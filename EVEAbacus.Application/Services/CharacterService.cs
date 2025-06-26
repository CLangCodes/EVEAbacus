using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.ESI.Character;

namespace EVEAbacus.Application.Services
{
    public class CharacterService : ICharacterService
    {
        private readonly IESIService _eSIService;
        
        public CharacterService(IESIService eSIService) 
        {
            _eSIService = eSIService;
        }

        async Task<CharacterEntity?> ICharacterService.GetCharacterAsync(string accessToken)
        {
            CharacterEntity? character = await _eSIService.GetPublicCharacterInfo(accessToken);

            if (character != null && character.CharacterId != null)
            {
                character.CharacterBlueprints =
                    await _eSIService.GetCharacterBlueprintsAsync(accessToken, (int)character.CharacterId);
                character.CharacterAttributes = 
                    await _eSIService.GetCharacterAttributesAsync(accessToken, (int)character.CharacterId);
                character.IndustryJobs =
                    await _eSIService.GetCharacterIndustryJobsAsync(accessToken, (int)character.CharacterId);
                character.MiningLedger =
                    await _eSIService.GetCharacterMiningLedgerAsync(accessToken, (int)character.CharacterId);
                character.SkillQueue = 
                    await _eSIService.GetCharacterSkillQueueAsync(accessToken, (int)character.CharacterId);
                character.SkillProfile =
                    await _eSIService.GetCharacterSkillsAsync(accessToken, (int)character.CharacterId);
                character.Standings =
                    await _eSIService.GetCharacterStandingsAsync(accessToken, (int)character.CharacterId);
            }
            return character;
        }
    }
}
