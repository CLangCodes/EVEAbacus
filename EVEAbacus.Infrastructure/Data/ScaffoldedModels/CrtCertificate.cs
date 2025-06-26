using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CrtCertificate
{
    public int CertificateId { get; set; }

    public int? GroupId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }
}
