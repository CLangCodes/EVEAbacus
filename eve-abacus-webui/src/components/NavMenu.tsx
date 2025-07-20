import Link from 'next/link';
import EVEAbacusLogo from './EVEAbacusLogo';

export function NavMenu() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link href="/">
            <span style={{ color: '#FFD700' }}>
              <EVEAbacusLogo height={40} />
            </span>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link href="/manufacturing-calculator" className="text-gray-300 hover:text-white">Manufacturing Calculator</Link>
          <Link href="/pi-planner" className="text-gray-300 hover:text-white">PI Planner</Link>
          <Link href="/invention-suggestion" className="text-gray-300 hover:text-white">Invention Suggestion</Link>
          <Link href="/swagger" className="text-gray-300 hover:text-white">API (Swagger)</Link>
        </div>
      </div>
    </nav>
  );
} 