"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaDownload, FaEye } from "react-icons/fa"; 
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Link,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface Location {
  id: number;
  name_location: string;
  date: Date;
  air4: Air4[];
}

interface Air4 {
  id: number;
  year: number;
  month: number;
  day: number;
  hours: number;
  createAt: Date;
  area: string;
  nameTH: string;
  nameEN: string;
  stationType: string;
  pm25_id: Pm25[];
  pm10_id: Pm10[];
  location_id: Location[];
}

interface Pm25 {
  id: number;
  color_id: number;
  aqi: number;
  value: number;
}

interface Pm10 {
  id: number;
  color_id: number;
  aqi: number;
  value: number;
}

interface DataLocation_Station {
  id: number;
  location_name: string;
  latitude: number;
  longitude: number;
}

const Pm25 = () => {
  const [locationStation, setLocationStation] = useState<DataLocation_Station[]>([]);
  const [province, setProvince] = useState<Air4[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [idlocation, setIdlocation] = useState<number>(0);
  const [namelocation, setNamelocation] = useState<string>("");
  const [dayDataAir4, setDayDataAir4] = useState<Air4[]>([]);
  const [monthDataAir4, setMonthDataAir4] = useState<Air4[]>([]);
  const [yearDataAir4, setYearDataAir4] = useState<Air4[]>([]);
  const [tokenvalue, setTokenvalue] = useState<string>("");
  const [tockenstatus, setTockenstatus] = useState<boolean>(false);
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);


  const downloadCSV = (data: Air4[], filename: string) => {
    const csvHeader = ["วันที่", "ชั่วโมง", "เขต", "สถานี", "PM2.5", "PM10"];
    const csvRows = data.map((item) => [
      `${item.day}/${item.month}/${item.year}`,
      item.hours,
      item.area,
      item.nameTH,
      item.pm25_id?.[0]?.value ?? "-",
      item.pm10_id?.[0]?.value ?? "-"
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [csvHeader, ...csvRows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rs = await fetch("https://cass-api-data.vercel.app/api/airlcation");
        const rs_json = await rs.json();
        setLocationStation(rs_json.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const api_checkProvince = async (name: string) => {
    const rs = await fetch(`https://cass-api-data.vercel.app/api/airpm111/${name}`)
    const rs_json = await rs.json();
    console.log("Province data fetched:", rs_json);
    setProvince(rs_json);
  };

  const availableDates: Date[] = province.map((item) => new Date(item.year, item.month - 1, item.day));

  const Day_dataPm = async () => {
    try {
      if (idlocation === 0 || !selectedDate) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      const rs = await fetch(`https://cass-api-data.vercel.app/api/airpm/${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${idlocation}`);
      const rs_json = await rs.json();
      setDayDataAir4(rs_json);
      setMonthDataAir4([]);
      setYearDataAir4([]);
    } catch (err) {
      console.error(err);
    }
  };

  const Month_dataPm = async () => {
    try {
      if (idlocation === 0 || !selectedDate) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      const rs = await fetch(`https://cass-api-data.vercel.app/api/airpm/${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}/${namelocation}`);
      const rs_json = await rs.json();
      setMonthDataAir4(rs_json);
      setDayDataAir4([]);
      setYearDataAir4([]);
    } catch (err) {
      console.error(err);
    }
  };

  const Year_dataPm = async () => {
    try {
      if (idlocation === 0 || !selectedDate) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      const rs = await fetch(`https://cass-api-data.vercel.app/api/airpm/${selectedDate.getFullYear()}/${namelocation}`);
      const rs_json = await rs.json();
      setYearDataAir4(rs_json);
      setMonthDataAir4([]);
      setDayDataAir4([]);
    } catch (err) {
      console.error(err);
    }
  };

const CheckTokenModal = ({ open, onClose, data, title }: any) => {
  const [tokenValue, setTokenValue] = useState("");

  const token = localStorage.getItem("token");
  const tokenOk = localStorage.getItem("tokenOk");

  const downloadCsv = () => {
    downloadCSV(data, title);
  };

  useEffect(() => {
    if (open && token && tokenOk === token) {
      downloadCsv();
      onClose();
    }
  }, [open]);

  const confirmToken = () => {
    if (!tokenValue) {
      alert("กรุณาใส่โทเคนก่อนยืนยัน");
      return;
    }
    if (tokenValue !== token) {
      alert("โทเคนไม่ถูกต้อง");
      return;
    }
    alert("ยืนยันโทเคนสำเร็จ");
    localStorage.setItem("tokenOk", tokenValue);
    downloadCsv();
    onClose();
  };

  if (!token || tokenOk !== token) {
    return (
      <Modal 
        open={open} 
        // onClose={onClose}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#f3f4f6",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            กรุณาใส่โทเคนเพื่อดาวน์โหลดข้อมูล
          </Typography>

          <TextField
            fullWidth
            value={tokenValue}
            onChange={(e) => setTokenValue(e.target.value)}
            placeholder="กรอกโทเคนที่นี่"
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmToken}
              startIcon={<ContentCopyIcon />}
            >
              ยืนยัน
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Link href="/login-" underline="hover">
              ล็อกอิน
            </Link>
          </Box>
        </Box>
      </Modal>
    );
  }

  return null;
};

  const renderStyledTable = (data: Air4[], title: string) => (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="text-center mb-4">
        <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setTockenstatus(prev => !prev)}
          >
            <FaDownload className="inline mr-2" />
            {tockenstatus ? "ปิด" : "ดาวน์โหลดข้อมูล"}
          </button>

          <CheckTokenModal
            open={tockenstatus}
            onClose={() => setTockenstatus(false)}
            data={data}
            title={title}
          />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300 mt-4">
        <table className="min-w-full bg-white text-left text-sm">
          <thead className="bg-blue-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">วันที่</th>
              <th className="py-3 px-4 border-b">ชั่วโมง</th>
              <th className="py-3 px-4 border-b">เขต</th>
              <th className="py-3 px-4 border-b">สถานี</th>
              <th className="py-3 px-4 border-b">PM2.5</th>
              <th className="py-3 px-4 border-b">PM10</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                <td className="py-2 px-4">{`${item.day}/${item.month}/${item.year}`}</td>
                <td className="py-2 px-4">{item.hours}</td>
                <td className="py-2 px-4">{item.area}</td>
                <td className="py-2 px-4">{item.nameTH}</td>
                <td className="py-2 px-4">{item.pm25_id?.[0]?.value ?? "-"}</td>
                <td className="py-2 px-4">{item.pm10_id?.[0]?.value ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center px-4 py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl space-y-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลือกสถานที่ตรวจวัด
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                setIdlocation(selectedId);
                const selected = locationStation.find((item) => item.id === selectedId);
                if (selected) {
                  api_checkProvince(selected.location_name);
                  setNamelocation(selected.location_name);
                }
              }}
            >
              <option value="">--เลือกสถานที่ตรวจวัด--</option>
              {locationStation.map((item) => (
                <option key={item.id} value={item.id}>{item.location_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลือกวันที่
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              includeDates={availableDates}
              placeholderText="เลือกวันที่"
              className="w-56 border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <button
              className="w-full bg-indigo-600 text-white hover:bg-blue-600 transition rounded-md p-2 mt-6"
              onClick={Day_dataPm}
            >
              ค้นหา
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-emerald-500 text-white px-5 py-2 rounded hover:bg-emerald-600 transition" onClick={Day_dataPm}>
            ดูข้อมูลรายวัน
          </button>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition" onClick={Month_dataPm}>
            ดูข้อมูลรายเดือน
          </button>
          <button className="bg-rose-500 text-white px-5 py-2 rounded hover:bg-rose-600 transition" onClick={Year_dataPm}>
            ดูข้อมูลรายปี
          </button>
        </div>

        {dayDataAir4.length > 0 && renderStyledTable(dayDataAir4, "ข้อมูลรายวัน")}
        {monthDataAir4.length > 0 && renderStyledTable(monthDataAir4, "ข้อมูลรายเดือน")}
        {yearDataAir4.length > 0 && renderStyledTable(yearDataAir4, "ข้อมูลรายปี")}
      </div>
    </div>
  );
};

export default Pm25;
