'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  FileText, 
  Send,
  CheckCircle,
  Upload,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobApplicationWizardProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationData {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  
  // Step 2: Education & Experience
  education: string;
  university: string;
  graduationYear: string;
  major: string;
  experience: string;
  previousJobs: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  
  // Step 3: Skills & Documents
  skills: string[];
  languages: string[];
  coverLetter: string;
  cvFile: File | null;
  expectedSalary: string;
  startDate: string;
  
  // Step 4: Additional Info
  workPreference: string;
  references: Array<{
    name: string;
    position: string;
    company: string;
    phone: string;
  }>;
  additionalInfo: string;
  agreeTerms: boolean;
}

const initialData: ApplicationData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  education: '',
  university: '',
  graduationYear: '',
  major: '',
  experience: '',
  previousJobs: [],
  skills: [],
  languages: [],
  coverLetter: '',
  cvFile: null,
  expectedSalary: '',
  startDate: '',
  workPreference: '',
  references: [],
  additionalInfo: '',
  agreeTerms: false
};

const skillOptions = [
  'Microsoft Office', 'Excel', 'PowerPoint', 'Photoshop', 'Illustrator',
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP',
  'Marketing Digital', 'SEO', 'Google Ads', 'Facebook Ads',
  'Kế toán', 'Thuế', 'Kiểm toán', 'Tài chính',
  'Bán hàng', 'Chăm sóc khách hàng', 'Tư vấn',
  'Tiếng Anh', 'Tiếng Trung', 'Tiếng Nhật', 'Tiếng Hàn'
];

const languageOptions = [
  'Tiếng Việt (Bản ngữ)', 'Tiếng Anh (Cơ bản)', 'Tiếng Anh (Trung cấp)', 
  'Tiếng Anh (Nâng cao)', 'Tiếng Trung (Cơ bản)', 'Tiếng Trung (Trung cấp)',
  'Tiếng Nhật (Cơ bản)', 'Tiếng Nhật (Trung cấp)', 'Tiếng Hàn (Cơ bản)'
];

export default function JobApplicationWizard({ job, isOpen, onClose }: JobApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPreviousJob = () => {
    setFormData(prev => ({
      ...prev,
      previousJobs: [...prev.previousJobs, {
        company: '',
        position: '',
        duration: '',
        description: ''
      }]
    }));
  };

  const updatePreviousJob = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      previousJobs: prev.previousJobs.map((job, i) => 
        i === index ? { ...job, [field]: value } : job
      )
    }));
  };

  const removePreviousJob = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previousJobs: prev.previousJobs.filter((_, i) => i !== index)
    }));
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, {
        name: '',
        position: '',
        company: '',
        phone: ''
      }]
    }));
  };

  const updateReference = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && formData.address);
      case 2:
        return !!(formData.education && formData.experience);
      case 3:
        return !!(formData.coverLetter && formData.expectedSalary && formData.startDate);
      case 4:
        return formData.agreeTerms;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc trước khi tiếp tục.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng hoàn thành tất cả thông tin và đồng ý với điều khoản.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Nộp đơn thành công!",
      description: "Đơn ứng tuyển của bạn đã được gửi đến nhà tuyển dụng.",
    });
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData(initialData);
    setIsSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nộp đơn thành công!</h3>
            <p className="text-slate-600 mb-4">
              Đơn ứng tuyển của bạn đã được gửi đến <strong>{job.company}</strong> cho vị trí <strong>{job.title}</strong>.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Nhà tuyển dụng sẽ liên hệ với bạn trong vòng 3-5 ngày làm việc.
            </p>
            <Button onClick={handleClose} className="w-full">
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nộp đơn ứng tuyển</DialogTitle>
          <DialogDescription>
            Vị trí: <strong>{job.title}</strong> tại <strong>{job.company}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Bước {currentStep} / {totalSteps}</span>
            <span>{Math.round(progress)}% hoàn thành</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step Content */}
        <div className="py-4">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Thông tin cá nhân</span>
                </CardTitle>
                <CardDescription>
                  Vui lòng cung cấp thông tin cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="0901234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Học vấn & Kinh nghiệm</span>
                </CardTitle>
                <CardDescription>
                  Thông tin về trình độ học vấn và kinh nghiệm làm việc
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Education */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Học vấn</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="education">Trình độ học vấn *</Label>
                      <Select value={formData.education} onValueChange={(value) => updateFormData('education', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trình độ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thpt">THPT</SelectItem>
                          <SelectItem value="cao-dang">Cao đẳng</SelectItem>
                          <SelectItem value="dai-hoc">Đại học</SelectItem>
                          <SelectItem value="thac-si">Thạc sĩ</SelectItem>
                          <SelectItem value="tien-si">Tiến sĩ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">Trường học</Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) => updateFormData('university', e.target.value)}
                        placeholder="Đại học ABC"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Chuyên ngành</Label>
                      <Input
                        id="major"
                        value={formData.major}
                        onChange={(e) => updateFormData('major', e.target.value)}
                        placeholder="Công nghệ thông tin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Năm tốt nghiệp</Label>
                      <Input
                        id="graduationYear"
                        value={formData.graduationYear}
                        onChange={(e) => updateFormData('graduationYear', e.target.value)}
                        placeholder="2020"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Kinh nghiệm làm việc</h4>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Tổng số năm kinh nghiệm *</Label>
                    <Select value={formData.experience} onValueChange={(value) => updateFormData('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kinh nghiệm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="khong-co">Chưa có kinh nghiệm</SelectItem>
                        <SelectItem value="duoi-1-nam">Dưới 1 năm</SelectItem>
                        <SelectItem value="1-2-nam">1-2 năm</SelectItem>
                        <SelectItem value="2-3-nam">2-3 năm</SelectItem>
                        <SelectItem value="3-5-nam">3-5 năm</SelectItem>
                        <SelectItem value="tren-5-nam">Trên 5 năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Previous Jobs */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Kinh nghiệm làm việc chi tiết</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addPreviousJob}>
                        Thêm công việc
                      </Button>
                    </div>
                    
                    {formData.previousJobs.map((job, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Công ty</Label>
                            <Input
                              value={job.company}
                              onChange={(e) => updatePreviousJob(index, 'company', e.target.value)}
                              placeholder="Tên công ty"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Vị trí</Label>
                            <Input
                              value={job.position}
                              onChange={(e) => updatePreviousJob(index, 'position', e.target.value)}
                              placeholder="Vị trí công việc"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Thời gian</Label>
                            <Input
                              value={job.duration}
                              onChange={(e) => updatePreviousJob(index, 'duration', e.target.value)}
                              placeholder="01/2020 - 12/2022"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removePreviousJob(index)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Label>Mô tả công việc</Label>
                          <Textarea
                            value={job.description}
                            onChange={(e) => updatePreviousJob(index, 'description', e.target.value)}
                            placeholder="Mô tả chi tiết về công việc và thành tích..."
                            rows={3}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Kỹ năng & Hồ sơ</span>
                </CardTitle>
                <CardDescription>
                  Thông tin về kỹ năng, ngôn ngữ và hồ sơ ứng tuyển
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills */}
                <div className="space-y-4">
                  <Label>Kỹ năng chuyên môn</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <Label htmlFor={`skill-${skill}`} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <Label>Ngoại ngữ</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {languageOptions.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${language}`}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={() => toggleLanguage(language)}
                        />
                        <Label htmlFor={`lang-${language}`} className="text-sm">
                          {language}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Thư xin việc *</Label>
                  <Textarea
                    id="coverLetter"
                    value={formData.coverLetter}
                    onChange={(e) => updateFormData('coverLetter', e.target.value)}
                    placeholder="Viết thư giới thiệu bản thân và lý do ứng tuyển vào vị trí này..."
                    rows={6}
                  />
                </div>

                {/* CV Upload */}
                <div className="space-y-2">
                  <Label htmlFor="cvFile">CV đính kèm</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">
                      Kéo thả file CV hoặc <Button variant="link" className="p-0 h-auto">chọn file</Button>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Hỗ trợ: PDF, DOC, DOCX (tối đa 5MB)
                    </p>
                  </div>
                </div>

                {/* Salary & Start Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedSalary">Mức lương mong muốn *</Label>
                    <Input
                      id="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={(e) => updateFormData('expectedSalary', e.target.value)}
                      placeholder="10-15 triệu VNĐ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày có thể bắt đầu làm việc *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData('startDate', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Thông tin bổ sung</span>
                </CardTitle>
                <CardDescription>
                  Hoàn tất hồ sơ ứng tuyển của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Work Preference */}
                <div className="space-y-2">
                  <Label htmlFor="workPreference">Hình thức làm việc mong muốn</Label>
                  <Select value={formData.workPreference} onValueChange={(value) => updateFormData('workPreference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hình thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toan-thoi-gian">Toàn thời gian</SelectItem>
                      <SelectItem value="ban-thoi-gian">Bán thời gian</SelectItem>
                      <SelectItem value="remote">Làm việc từ xa</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* References */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Người giới thiệu</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addReference}>
                      Thêm người giới thiệu
                    </Button>
                  </div>
                  
                  {formData.references.map((ref, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Họ tên</Label>
                          <Input
                            value={ref.name}
                            onChange={(e) => updateReference(index, 'name', e.target.value)}
                            placeholder="Nguyễn Văn B"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Chức vụ</Label>
                          <Input
                            value={ref.position}
                            onChange={(e) => updateReference(index, 'position', e.target.value)}
                            placeholder="Giám đốc"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Công ty</Label>
                          <Input
                            value={ref.company}
                            onChange={(e) => updateReference(index, 'company', e.target.value)}
                            placeholder="Công ty XYZ"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Số điện thoại</Label>
                          <div className="flex space-x-2">
                            <Input
                              value={ref.phone}
                              onChange={(e) => updateReference(index, 'phone', e.target.value)}
                              placeholder="0901234567"
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeReference(index)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Thông tin bổ sung</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                    placeholder="Thông tin khác mà bạn muốn chia sẻ với nhà tuyển dụng..."
                    rows={4}
                  />
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => updateFormData('agreeTerms', checked)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-relaxed">
                    Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý với{' '}
                    <Button variant="link" className="p-0 h-auto text-blue-600">
                      điều khoản sử dụng
                    </Button>{' '}
                    và{' '}
                    <Button variant="link" className="p-0 h-auto text-blue-600">
                      chính sách bảo mật
                    </Button>{' '}
                    của công ty. *
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>
                Tiếp theo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !validateStep(4)}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Nộp đơn
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
