import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { CurrencyRate } from '@/models/Currency';

export const dynamic = 'force-dynamic';

// GET /api/currencies/[id] - Lấy thông tin một loại tiền tệ
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const currency = await CurrencyRate.findById(params.id);
    
    if (!currency) {
      return NextResponse.json(
        { status: 'error', message: 'Currency not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      status: 'success',
      data: currency
    });
  } catch (error: any) {
    console.error('Error fetching currency:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/currencies/[id] - Cập nhật thông tin loại tiền tệ
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Kiểm tra tiền tệ tồn tại
    const currency = await CurrencyRate.findById(params.id);
    if (!currency) {
      return NextResponse.json(
        { status: 'error', message: 'Currency not found' },
        { status: 404 }
      );
    }
    
    // Nếu đây là tiền tệ cơ sở, đảm bảo chỉ có một tiền tệ cơ sở
    if (body.isBaseCurrency) {
      await CurrencyRate.updateMany(
        { _id: { $ne: params.id }, isBaseCurrency: true },
        { $set: { isBaseCurrency: false } }
      );
      body.rate = 1; // Tiền tệ cơ sở luôn có tỉ giá là 1
    }
    
    // Cập nhật thông tin
    const updatedCurrency = await CurrencyRate.findByIdAndUpdate(
      params.id,
      {
        ...body,
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      status: 'success',
      data: updatedCurrency,
      message: 'Currency updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating currency:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/currencies/[id] - Xóa loại tiền tệ
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Kiểm tra tiền tệ tồn tại
    const currency = await CurrencyRate.findById(params.id);
    if (!currency) {
      return NextResponse.json(
        { status: 'error', message: 'Currency not found' },
        { status: 404 }
      );
    }
    
    // Không cho phép xóa tiền tệ cơ sở
    if (currency.isBaseCurrency) {
      return NextResponse.json(
        { status: 'error', message: 'Cannot delete base currency' },
        { status: 400 }
      );
    }
    
    // Xóa tiền tệ
    await CurrencyRate.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      status: 'success',
      message: 'Currency deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting currency:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
