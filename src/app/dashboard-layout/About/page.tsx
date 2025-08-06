import imagesnru from '../../Image/snru-logo-n.png';

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6">เกี่ยวกับเรา</h1>
        <div className="mb-8">
          <img 
            src={imagesnru.src} 
            alt="Sakon Nakhon Rajabhat University Logo" 
            className="mx-auto h-32 object-contain"
          />
        </div>
        <div className="text-lg text-gray-700 leading-relaxed">
          <p className="mb-4">
            การพัฒนาเว็บแอปพลิเคชัน PM2.5ESAN เป็นส่วนหนึ่งของโครงการวิจัย
            <q className="italic font-semibold text-blue-700">การพัฒนาแบบจำลองการกระจายตัวของฝุ่น PM2.5 ในแนวดิ่งและแนวราบโดยใช้ข้อมูลดาวเทียมและข้อมูลภาคพื้นดินในภาคตะวันออกเฉียงเหนือของประเทศไทย เพื่อประเมินความเสี่ยงของการเกิดโรคระบบทางเดินหายใจ</q>
            ได้รับทุนสนับสนุนจากมหาวิทยาลัยราชภัฏสกลนคร
          </p>
          <p>
            ในเว็บแอปพลิเคชันนี้จะแสดงความเข้มข้นของฝุ่น PM2.5 และระดับความสูงของฝุ่น PM2.5 ในบรรยากาศ 
            พร้อมทั้งส่งข้อความแจ้งเตือนไปยังมือถือของผู้ใช้งานเมื่อความเข้มข้นของฝุ่น PM2.5 เกินค่ามาตรฐาน 
            เพื่อนำไปสู่การประเมินความเสี่ยงจากการเกิดโรคระบบทางเดินหายใจ และเป็นแนวทางในการป้องกันภัยจากฝุ่น PM2.5
          </p>
        </div>
      </div>
    </div>
  );
}