using EVEAbacus.Domain.Models.ESI.Character.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Character
{
    public class CharacterStanding
    {
        public int FromId { get; set; }
        public required string FromType { get; set; }
        public float Standing { get; set; }
    }
}
