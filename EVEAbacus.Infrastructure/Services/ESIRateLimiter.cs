using System.Collections.Concurrent;
using System.Threading;

namespace EVEAbacus.Infrastructure.Services
{
    public class ESIRateLimiter
    {
        private readonly SemaphoreSlim _secondLimiter = new(20, 20);
        private readonly SemaphoreSlim _minuteLimiter = new(100, 100);
        private readonly SemaphoreSlim _hourLimiter = new(1000, 1000);
        private readonly ConcurrentDictionary<DateTime, int> _minuteRequests = new();
        private readonly ConcurrentDictionary<DateTime, int> _hourRequests = new();
        private readonly Timer _cleanupTimer;
        private readonly object _cleanupLock = new();

        public ESIRateLimiter()
        {
            // Clean up old requests every minute
            _cleanupTimer = new Timer(CleanupOldRequests, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
        }

        public async Task AcquireAsync()
        {
            await _secondLimiter.WaitAsync();
            await _minuteLimiter.WaitAsync();
            await _hourLimiter.WaitAsync();

            var now = DateTime.UtcNow;
            _minuteRequests.AddOrUpdate(now, 1, (_, count) => count + 1);
            _hourRequests.AddOrUpdate(now, 1, (_, count) => count + 1);
        }

        public void Release()
        {
            _secondLimiter.Release();
            _minuteLimiter.Release();
            _hourLimiter.Release();
        }

        private void CleanupOldRequests(object? state)
        {
            lock (_cleanupLock)
            {
                var now = DateTime.UtcNow;
                var minuteCutoff = now.AddMinutes(-1);
                var hourCutoff = now.AddHours(-1);

                // Clean up minute requests
                var minuteKeys = _minuteRequests.Keys.Where(k => k < minuteCutoff).ToList();
                foreach (var key in minuteKeys)
                {
                    if (_minuteRequests.TryRemove(key, out var count))
                    {
                        for (int i = 0; i < count; i++)
                        {
                            try
                            {
                                _minuteLimiter.Release();
                            }
                            catch (SemaphoreFullException)
                            {
                                // Ignore if we somehow try to release more than we should
                                break;
                            }
                        }
                    }
                }

                // Clean up hour requests
                var hourKeys = _hourRequests.Keys.Where(k => k < hourCutoff).ToList();
                foreach (var key in hourKeys)
                {
                    if (_hourRequests.TryRemove(key, out var count))
                    {
                        for (int i = 0; i < count; i++)
                        {
                            try
                            {
                                _hourLimiter.Release();
                            }
                            catch (SemaphoreFullException)
                            {
                                // Ignore if we somehow try to release more than we should
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
} 