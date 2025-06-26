namespace EVEAbacus.Application.Interfaces
{
    public interface IRepository 
    {
        Task CreateObjectAsync<T>(T context) where T : class;
        Task<T?> GetObjectAsync<T>(int Id) where T : class;
        Task DeleteObjectAsync<T>(T context) where T : class;
        Task EditObjectAsync<T>(T context) where T : class;
    }
}
