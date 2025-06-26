using System.ComponentModel.DataAnnotations;

namespace EVEAbacus.Domain.Models.Blueprint
{
    /// <summary>
    /// Request model for blueprint-related operations
    /// </summary>
    public class BlueprintRequest
    {
        /// <summary>
        /// The TypeID of the blueprint
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "TypeID must be greater than 0")]
        public int Id { get; set; }
    }
} 