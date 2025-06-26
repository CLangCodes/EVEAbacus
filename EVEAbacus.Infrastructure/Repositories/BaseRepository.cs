using EVEAbacus.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using EVEAbacus.Infrastructure.Data;

namespace EVEAbacus.Infrastructure.Repositories{
    public abstract class BaseRepository : IRepository 
    {
        protected readonly IDbContextFactory<EVEAbacusDbContext> _dbContextFactory;

        protected BaseRepository(IDbContextFactory<EVEAbacusDbContext> dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }

        public virtual async Task CreateObjectAsync<T>(T context) where T : class
        {
            using var dbContext = _dbContextFactory.CreateDbContext();
            await dbContext.Set<T>().AddAsync(context);
            await dbContext.SaveChangesAsync();
        }

        public virtual async Task<T?> GetObjectAsync<T>(int Id) where T : class
        {
            using var dbContext = _dbContextFactory.CreateDbContext();
            return await dbContext.Set<T>().FindAsync(Id);
        }

        public virtual async Task DeleteObjectAsync<T>(T context) where T : class
        {
            using var dbContext = _dbContextFactory.CreateDbContext();
            dbContext.Set<T>().Remove(context);
            await dbContext.SaveChangesAsync();
        }

        public virtual async Task EditObjectAsync<T>(T context) where T : class
        {
            using var dbContext = _dbContextFactory.CreateDbContext();
            dbContext.Set<T>().Update(context);
            await dbContext.SaveChangesAsync();
        }
    }
}