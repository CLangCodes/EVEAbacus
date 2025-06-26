using EVEAbacus.Domain.Models.ESI.Character;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Application.Interfaces
{
    public interface ICharacterService
    {
        Task<CharacterEntity?> GetCharacterAsync(string accessToken);
    }
}
