using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EVEAbacus.Domain.Models.Calculator
{
    /// <summary>
    /// Data transfer object for blueprint manufacturing orders
    /// </summary>
    public class OrderDTO
    {
        /// <summary>
        /// The exact name of the blueprint in EVE Online
        /// </summary>
        public string BlueprintName { get; set; } = string.Empty;

        /// <summary>
        /// Type of activity (1 = Manufacturing, default)
        /// </summary>
        public byte ActivityId { get; set; } = 1;

        /// <summary>
        /// Number of blueprint copies to produce
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "You must use at least one copy.")]
        public int Copies { get; set; } = 1;

        /// <summary>
        /// Number of manufacturing runs per copy
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "You must have at least one run.")]
        public int Runs { get; set; } = 1;

        /// <summary>
        /// Material Efficiency level, reduces material requirements
        /// </summary>
        [Range(0, 10, ErrorMessage = "Material Efficiency must be between 0-10")]
        public int ME { get; set; } = 0;

        /// <summary>
        /// Time Efficiency level, reduces production time (must be zero or even)
        /// </summary>
        [Range(0, 20, ErrorMessage = "Time Efficiency must be between 0-20")]
        [EvenOnly(ErrorMessage = "TE must be an even number.")]
        public int TE { get; set; } = 0;

        /// <summary>
        /// Optional reference to parent blueprint type ID
        /// </summary>
        [JsonIgnore]
        public int? ParentBlueprintTypeId { get; set; }
    }

    /// <summary>
    /// Validation attribute to ensure a value is even
    /// </summary>
    public class EvenOnlyAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is int intVal)
                return intVal % 2 == 0;

            return true;
        }
    }
}
