using System.Text.Json.Serialization;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class CustomBlueprint
    {
        public int BlueprintTypeId { get; set; }
        public int MaterialEfficiency { get; set; } = 0;
        public int TimeEfficiency { get; set; } = 0;
    }
}