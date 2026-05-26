import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Revision from '@/lib/models/Revision';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper to return mock data if MongoDB is not connected
const getMockRevisions = () => [
  {
    _id: 'mock-rev-1',
    title: 'Snowflake COPY INTO Optimization',
    question: 'How to process million of data rows using Snowflake efficiently?',
    answer: '1. **File Sizing**: Keep files between 100MB and 250MB compressed. Too many small files causes overhead.\n2. **COPY INTO Command**: Use the standard COPY INTO table command which runs in parallel. Avoid insert statements.\n3. **Warehouse Scaling**: Scale up warehouse size (e.g. from X-Small to Medium or Large) to increase cluster computing power for high-volume ingestions.\n4. **Auto-Ingest (Snowpipe)**: Utilize Snowpipe for real-time continuous ingestion instead of huge batches.',
    category: 'Snowflake',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    _id: 'mock-rev-2',
    title: 'AWS EMR Spark Security Protocol',
    question: 'How to make data pipelines secure in AWS EMR?',
    answer: '1. **Network Security**: Launch EMR clusters in private VPC subnets. Access via SSH or client endpoints with strict Security Groups.\n2. **Encryption at Rest**: Configure EMR Security Configurations with AWS KMS to encrypt data stored in S3 (SSE-S3 or SSE-KMS) and local HDFS/EBS volumes.\n3. **Access Controls**: Assign IAM Roles to EMR instances. Use AWS Lake Formation or Apache Ranger to enforce fine-grained database/table/column levels permissioning.\n4. **In-Transit Security**: Enable SSL/TLS encryption for intra-cluster nodes communication.',
    category: 'Cloud Security',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ data: getMockRevisions(), isMock: true });
    }
    const revisions = await Revision.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ data: revisions, isMock: false });
  } catch (error) {
    console.error('Error fetching revisions:', error);
    return NextResponse.json({ data: getMockRevisions(), isMock: true, error: error.message });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const body = await req.json();
    const db = await dbConnect();
    if (!db) {
      const newMockItem = {
        _id: 'mock-rev-' + Math.random().toString(36).substr(2, 9),
        ...body,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({ data: newMockItem, isMock: true });
    }
    const newRevision = await Revision.create({ ...body, userId });
    return NextResponse.json({ data: newRevision, isMock: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || 'default_user';

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ success: true, isMock: true });
    }
    await Revision.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ success: true, isMock: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
