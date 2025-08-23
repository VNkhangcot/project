import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { CurrencyRate } from '@/models/Currency';

export const dynamic = 'force-dynamic';

// GET /api/currencies - Lấy danh sách tất cả các loại tiền tệ
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Lấy các tham số truy vấn từ URL
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const isActive = url.searchParams.get('isActive');
    
    // Xây dựng điều kiện truy vấn
    const query: any = {};
    
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    // Thực hiện truy vấn
    const currencies = await CurrencyRate.find(query).sort({ isBaseCurrency: -1, code: 1 });
    
    return NextResponse.json({
      status: 'success',
      data: currencies,
      count: currencies.length,
      total: await CurrencyRate.countDocuments()
    });
  } catch (error: any) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/currencies - Tạo loại tiền tệ mới
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Sử dụng dynamic = 'force-dynamic' để tránh lỗi static generation
    const body = await req.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!body.code || !body.name || !body.symbol) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Kiểm tra mã tiền tệ đã tồn tại chưa
    const existingCurrency = await CurrencyRate.findOne({ code: body.code.toUpperCase() });
    if (existingCurrency) {
      return NextResponse.json(
        { status: 'error', message: 'Currency code already exists' },
        { status: 400 }
      );
    }
    
    // Nếu đây là tiền tệ cơ sở, đảm bảo chỉ có một tiền tệ cơ sở
    if (body.isBaseCurrency) {
      await CurrencyRate.updateMany(
        { isBaseCurrency: true },
        { $set: { isBaseCurrency: false } }
      );
      body.rate = 1; // Tiền tệ cơ sở luôn có tỉ giá là 1
    }
    
    // Tạo tiền tệ mới
    const newCurrency = new CurrencyRate({
      code: body.code.toUpperCase(),
      name: body.name,
      symbol: body.symbol,
      rate: body.rate || 1,
      isBaseCurrency: body.isBaseCurrency || false,
      isActive: body.isActive !== undefined ? body.isActive : true,
      lastUpdated: new Date()
    });
    
    await newCurrency.save();
    
    return NextResponse.json({
      status: 'success',
      data: newCurrency,
      message: 'Currency created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating currency:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
