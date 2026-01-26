import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Shield, Lock, Server, Eye, Key, FileCheck, AlertTriangle, CheckCircle, Clock, Users, Globe, Fingerprint, Database, Code, Mail, Award } from "lucide-react";
import { Footer } from "../components/marketing/Footer";

export default function Security() {
  const securityFeatures = [
    {
      title: "End-to-End Encryption",
      description: "All data in transit is protected with TLS 1.3 encryption. Data at rest is encrypted using AES-256, the same standard used by banks and government agencies.",
      icon: Lock
    },
    {
      title: "SOC 2 Type II Certified",
      description: "Our infrastructure and processes have been independently audited and certified to meet the rigorous SOC 2 Type II standards for security, availability, and confidentiality.",
      icon: Award
    },
    {
      title: "Zero-Knowledge Architecture",
      description: "We implement zero-knowledge principles where possible. Your sensitive data remains encrypted and inaccessible even to our own employees.",
      icon: Eye
    },
    {
      title: "Multi-Factor Authentication",
      description: "Protect your account with multiple authentication factors including TOTP apps, hardware security keys (WebAuthn/FIDO2), and biometric verification.",
      icon: Fingerprint
    },
    {
      title: "Role-Based Access Control",
      description: "Fine-grained permissions ensure team members only have access to the resources they need. All access is logged and auditable.",
      icon: Users
    },
    {
      title: "Continuous Monitoring",
      description: "Our security operations center monitors for threats 24/7/365. Automated systems detect and respond to anomalies in real-time.",
      icon: Clock
    }
  ];

  const infrastructure = [
    {
      title: "Cloud Infrastructure",
      items: [
        "Hosted on enterprise-grade cloud providers (AWS, GCP)",
        "Multiple availability zones for high availability",
        "Automatic failover and disaster recovery",
        "DDoS protection and WAF at the edge"
      ]
    },
    {
      title: "Network Security",
      items: [
        "Private network isolation (VPC)",
        "Intrusion detection and prevention systems (IDS/IPS)",
        "Network segmentation and firewalls",
        "Regular penetration testing by third parties"
      ]
    },
    {
      title: "Application Security",
      items: [
        "Secure software development lifecycle (SSDLC)",
        "Automated security scanning in CI/CD pipelines",
        "Regular dependency vulnerability scanning",
        "Code review requirements for all changes"
      ]
    }
  ];

  const compliance = [
    { name: "SOC 2 Type II", status: "Certified", description: "Security, availability, and confidentiality controls" },
    { name: "GDPR", status: "Compliant", description: "European data protection regulation" },
    { name: "CCPA", status: "Compliant", description: "California Consumer Privacy Act" },
    { name: "ISO 27001", status: "In Progress", description: "Information security management" },
    { name: "HIPAA", status: "Available", description: "Healthcare data protection (Enterprise plan)" },
    { name: "PCI DSS", status: "Compliant", description: "Payment card industry standards" },
  ];

  const practices = [
    {
      title: "Vulnerability Management",
      icon: AlertTriangle,
      description: "We maintain a comprehensive vulnerability management program that includes regular scanning, prioritization, and remediation of security vulnerabilities. Critical vulnerabilities are addressed within 24 hours."
    },
    {
      title: "Incident Response",
      icon: Clock,
      description: "Our incident response team is on call 24/7. We have documented procedures for detecting, responding to, and recovering from security incidents. All incidents are thoroughly investigated and documented."
    },
    {
      title: "Employee Security",
      icon: Users,
      description: "All employees undergo background checks and security training. Access to production systems is strictly limited and requires multi-factor authentication. We follow the principle of least privilege."
    },
    {
      title: "Vendor Security",
      icon: Globe,
      description: "We carefully evaluate the security posture of all third-party vendors. Vendors with access to customer data must meet our security requirements and sign data processing agreements."
    },
    {
      title: "Data Protection",
      icon: Database,
      description: "Customer data is isolated using logical separation. Backups are encrypted and stored in geographically separate locations. We support customer-managed encryption keys for Enterprise customers."
    },
    {
      title: "Secure Development",
      icon: Code,
      description: "Our development team follows secure coding practices based on OWASP guidelines. All code changes require peer review and automated security testing before deployment."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/5 py-4 px-6 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-orange-600 rounded flex items-center justify-center text-white">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-lg tracking-tighter">HeftCoder</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
        <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm mb-8">
            <Shield size={16} />
            <span>Enterprise-Grade Security</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-100 to-green-300 bg-clip-text text-transparent">
            Security at HeftCoder
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We take security seriously. Your code, your data, and your trust are protected by industry-leading security practices and infrastructure.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Security Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Built-in protections to keep your data safe</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-green-500/30 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent via-green-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Secure Infrastructure</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Multiple layers of protection at every level</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {infrastructure.map((section, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-6">
                  <Server className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-bold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Compliance & Certifications</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Meeting the highest industry standards</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {compliance.map((item, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-green-500/20 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Certified' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'Compliant' ? 'bg-blue-500/20 text-blue-400' :
                    item.status === 'Available' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Security Practices</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">How we protect your data every day</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {practices.map((practice, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-green-500/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10 flex-shrink-0">
                    <practice.icon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{practice.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{practice.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bug Bounty */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-green-500/10 to-orange-500/10 border border-green-500/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Key className="w-10 h-10 text-green-500" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">Bug Bounty Program</h2>
                <p className="text-gray-400 mb-6">
                  We partner with security researchers to identify and fix vulnerabilities. Report a valid security issue and earn rewards up to $10,000.
                </p>
                <a href="mailto:security@heftcoder.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors">
                  <FileCheck className="w-5 h-5" />
                  Report a Vulnerability
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Center */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
            <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Security?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Our security team is here to help. Reach out for security assessments, compliance documentation, or any security-related questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:security@heftcoder.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors">
                <Mail className="w-5 h-5" />
                security@heftcoder.com
              </a>
              <Link to="/docs" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors">
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
