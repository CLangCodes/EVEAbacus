namespace EVEAbacus.WebUI.Models
{
    /// <summary>
    /// Simple test request model
    /// </summary>
    public class TestRequest
    {
        /// <summary>
        /// The name to test
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// The count to test
        /// </summary>
        public int Count { get; set; } = 0;
    }
} 