export interface Contract {
  id: string;
  name: string;
  parties: string[];
  expiryDate: string;
  status: 'Active' | 'Renewal Due' | 'Expired';
  riskScore: 'Low' | 'Medium' | 'High';
  uploadDate: string;
  fileType: string;
}

export const mockContracts: Contract[] = [
  {
    id: '1',
    name: 'Software License Agreement - Adobe',
    parties: ['TechCorp Inc.', 'Adobe Systems'],
    expiryDate: '2024-12-15',
    status: 'Active',
    riskScore: 'Low',
    uploadDate: '2024-01-15',
    fileType: 'PDF'
  },
  {
    id: '2',
    name: 'Service Agreement - CloudHost',
    parties: ['TechCorp Inc.', 'CloudHost Solutions'],
    expiryDate: '2024-10-30',
    status: 'Renewal Due',
    riskScore: 'Medium',
    uploadDate: '2023-10-30',
    fileType: 'DOCX'
  },
  {
    id: '3',
    name: 'Employment Contract - John Smith',
    parties: ['TechCorp Inc.', 'John Smith'],
    expiryDate: '2024-06-30',
    status: 'Expired',
    riskScore: 'High',
    uploadDate: '2023-06-30',
    fileType: 'PDF'
  },
  {
    id: '4',
    name: 'Vendor Agreement - Office Supplies',
    parties: ['TechCorp Inc.', 'Office Direct Ltd.'],
    expiryDate: '2025-03-20',
    status: 'Active',
    riskScore: 'Low',
    uploadDate: '2024-03-20',
    fileType: 'PDF'
  },
  {
    id: '5',
    name: 'Consulting Agreement - DataAnalytics Pro',
    parties: ['TechCorp Inc.', 'DataAnalytics Pro'],
    expiryDate: '2024-11-15',
    status: 'Renewal Due',
    riskScore: 'Medium',
    uploadDate: '2023-11-15',
    fileType: 'DOCX'
  },
  {
    id: '6',
    name: 'Marketing Partnership - SocialBoost',
    parties: ['TechCorp Inc.', 'SocialBoost Agency'],
    expiryDate: '2024-08-10',
    status: 'Expired',
    riskScore: 'High',
    uploadDate: '2023-08-10',
    fileType: 'PDF'
  },
  {
    id: '7',
    name: 'Software Development Contract - DevStudio',
    parties: ['TechCorp Inc.', 'DevStudio LLC'],
    expiryDate: '2025-01-25',
    status: 'Active',
    riskScore: 'Low',
    uploadDate: '2024-01-25',
    fileType: 'PDF'
  },
  {
    id: '8',
    name: 'Equipment Lease - PrinterCorp',
    parties: ['TechCorp Inc.', 'PrinterCorp'],
    expiryDate: '2024-09-05',
    status: 'Expired',
    riskScore: 'Medium',
    uploadDate: '2023-09-05',
    fileType: 'DOCX'
  }
];

export interface ContractDetail {
  id: string;
  contract: Contract;
  clauses: Array<{
    id: string;
    title: string;
    snippet: string;
    confidence: number;
    type: 'termination' | 'liability' | 'payment' | 'renewal' | 'other';
  }>;
  aiInsights: {
    risks: Array<{
      id: string;
      title: string;
      description: string;
      severity: 'Low' | 'Medium' | 'High';
    }>;
    recommendations: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  evidence: Array<{
    id: string;
    snippet: string;
    pageNumber: number;
    relevanceScore: number;
    context: string;
  }>;
}

export const getContractDetail = (contractId: string): ContractDetail | null => {
  const contract = mockContracts.find(c => c.id === contractId);
  if (!contract) return null;

  return {
    id: contractId,
    contract,
    clauses: [
      {
        id: 'clause-1',
        title: 'Termination Clause',
        snippet: 'Either party may terminate this agreement with 30 days written notice...',
        confidence: 95,
        type: 'termination'
      },
      {
        id: 'clause-2',
        title: 'Payment Terms',
        snippet: 'Payment shall be made within 15 days of invoice date...',
        confidence: 88,
        type: 'payment'
      },
      {
        id: 'clause-3',
        title: 'Liability Limitation',
        snippet: 'In no event shall either party be liable for indirect damages...',
        confidence: 92,
        type: 'liability'
      }
    ],
    aiInsights: {
      risks: [
        {
          id: 'risk-1',
          title: 'Short Termination Notice',
          description: 'The 30-day termination notice period may be insufficient for business continuity planning.',
          severity: contract.riskScore
        },
        {
          id: 'risk-2',
          title: 'Payment Terms Risk',
          description: 'The 15-day payment period could impact cash flow management.',
          severity: 'Medium'
        }
      ],
      recommendations: [
        {
          id: 'rec-1',
          title: 'Extend Termination Notice',
          description: 'Consider negotiating a 60-day notice period for better planning.'
        },
        {
          id: 'rec-2',
          title: 'Payment Terms Review',
          description: 'Negotiate extended payment terms to 30 days for better cash flow.'
        }
      ]
    },
    evidence: [
      {
        id: 'evidence-1',
        snippet: 'The termination clause appears in section 8.2 of the agreement...',
        pageNumber: 5,
        relevanceScore: 0.95,
        context: 'Termination and Renewal Provisions'
      },
      {
        id: 'evidence-2',
        snippet: 'Payment obligations are detailed in the financial terms section...',
        pageNumber: 3,
        relevanceScore: 0.88,
        context: 'Financial Obligations'
      }
    ]
  };
};