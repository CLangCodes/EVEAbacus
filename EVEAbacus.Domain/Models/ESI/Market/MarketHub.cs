using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static EVEAbacus.Domain.Models.ESI.Market.MarketHub;

namespace EVEAbacus.Domain.Models.ESI.Market
{
    public class MarketHub
    {
        public enum MarketHubStation : long
        {
            Amarr = 60008494,
            Dodixie = 60011866,
            Hek = 60005686,
            Jita = 60003760,
            Rens = 60004588
        }
    }
    public static class MarketHubStationExtensions
    {
        public static string GetStationName(this MarketHubStation station) => station switch
        {
            MarketHubStation.Amarr => "Amarr VIII (Oris) - Emperor Family Academy",
            MarketHubStation.Dodixie => "Dodixie IX - Moon 20 - Federation Navy Assembly Plant",
            MarketHubStation.Hek => "Hek VIII - Moon 12 - Boundless Creation Factory",
            MarketHubStation.Jita => "Jita IV - Moon 4 - Caldari Navy Assembly Plant",
            MarketHubStation.Rens => "Rens VI - Moon 8 - Brutor Tribe Treasury",
            _ => "Unknown"
        };
    }
}
