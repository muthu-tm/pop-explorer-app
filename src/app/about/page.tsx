'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="qproof-card">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/qproof_logo.png" 
                alt="QProof Logo" 
                className="w-12 h-12"
              />
              <h1 className="text-4xl font-bold text-gray-900">
                QProof Explorer
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Verifiable Bitcoin Provenance, Made Simple
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is QProof Explorer?</h2>
              <p className="text-gray-700 mb-4">
                QProof Explorer is an external service designed to make it easy to track QProof provenance for Bitcoin transactions. It provides a clear view of how transaction outputs (UTXOs) and public keys are registered, verified, and finalized across blocks.
              </p>
              <p className="text-gray-700 mb-4">
                With QProof Explorer, you can:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Search by UTXO ID or public key</li>
                <li>View when and where an item was first included in a block</li>
                <li>Access full inclusion proofs (Merkle proofs) for finalized data</li>
                <li>Explore provenance to verify legitimacy over time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why is this important?</h2>
              <p className="text-gray-700 mb-4">
                The QProof protocol ensures that every transaction is backed by a verifiable chain of cryptographic evidence. This strengthens trust in Bitcoin transactions by making their legitimacy transparent and auditable.
              </p>
              <p className="text-gray-700 mb-4">
                QProof Explorer serves as the public window into that process. Whether you are a wallet user, developer, or auditor, the explorer makes it simple to validate:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>That your keys have been included since a specific block</li>
                <li>That your UTXOs trace back to legitimate provenance</li>
                <li>That your final proofs are complete and tamper-resistant</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How does it work?</h2>
              <p className="text-gray-700 mb-4">
                The protocol uses quantum-resistant cryptography to double-sign Bitcoin transactions. This means every action is bound both by Bitcoin&apos;s proof-of-work consensus and by QProof&apos;s cryptographic ledger.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Wallets generate microproofs and final proofs.</li>
                  <li>Servers verify that the keys and UTXOs were registered at least one block before they are used.</li>
                  <li>QProof Explorer displays these records and lets anyone independently check provenance and inclusion proofs.</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Live Stream View</h3>
                  <p className="text-gray-700">
                    Watch inclusions being added to the current block in real-time as they are processed and finalized.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Deep Search</h3>
                  <p className="text-gray-700">
                    Search by UTXO ID, public key, or block number to dive deep into specific transaction details.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Proof Verification</h3>
                  <p className="text-gray-700">
                    Access complete Merkle proofs and verify the cryptographic integrity of any inclusion.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Provenance Tracking</h3>
                  <p className="text-gray-700">
                    Trace the complete history of UTXOs and keys from their first registration to current status.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
              <div className="bg-[#00CA65] bg-opacity-10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Start Guide</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li><strong>Home Page:</strong> Start by viewing the live stream of current block inclusions</li>
                  <li><strong>Search:</strong> Use the search bar to find specific UTXOs, keys, or blocks</li>
                  <li><strong>Explore:</strong> Click on any ID to view detailed information and proofs</li>
                  <li><strong>Verify:</strong> Check proof verification status and download complete proof data</li>
                </ol>
              </div>
            </section>

            <section className="text-center">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ⚡ QProof Explorer
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Verifiable Bitcoin Provenance, Made Simple
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <Link href="/" className="hover:text-[#00CA65] transition-colors">Home</Link>
                  <span>•</span>
                  <a href="#" className="hover:text-[#00CA65] transition-colors">API Documentation</a>
                  <span>•</span>
                  <a href="#" className="hover:text-[#00CA65] transition-colors">GitHub Repository</a>
                </div>
              </div>
            </section>
          </div>
        </div>
    </div>
  );
}
