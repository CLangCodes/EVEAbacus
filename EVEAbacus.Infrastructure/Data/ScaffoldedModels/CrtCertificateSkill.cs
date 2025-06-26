using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CrtCertificateSkill
{
    public int? CertificateId { get; set; }

    public byte? MasteryLevel { get; set; }

    public string? MasteryText { get; set; }

    public int? SkillTypeId { get; set; }

    public byte? RequiredSkillLevel { get; set; }
}
