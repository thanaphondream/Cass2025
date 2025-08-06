"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaDownload, FaEye } from "react-icons/fa"; 
import { PiOven } from "react-icons/pi";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Link,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface MeteorologicalData {
  id: number;
  year: number;
  month: number;
  day: number;
  hours: number;
  temperaturde: number;
  humidity: number;
  slp: number;
  rain: number;
  windspeed10m: number;
  winddirdedtion10m: number;
  lowcloud: number;
  highcloud: number;
  date: string;
}

interface LocationData {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  date: string;
  meteorological_id: MeteorologicalData[];
}

interface Locations {
  id: number;
  locationaname: string;
  latitude: number;
  longitude: number;
  date: Date;
}

const DownloadPage = () => {
  const [locations, setLocations] = useState<Locations[]>([]);
  const [provincialStation, setProvincialStation] = useState<String>()
  const [province, setProvince] = useState<MeteorologicalData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [pushnamelocation, setPushnamelocation] = useState<String  >("")
  const [location_day, setLocation_day] = useState<LocationData[]>([])
  const [location_month, setLocation_month] = useState<LocationData[]>([])
  const [location_year, setLocation_year] = useState<LocationData[]>([])
  const [viewData, setViewData] = useState<Record<number, MeteorologicalData[]>>({});
  const [idlocation, setIdlocation] = useState<Number>(0)
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [open, setOpen] = useState(true);
  const [tockenstatus, setTockenstatus] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const rs = await fetch("https://cass-api-data.vercel.app/api/climatedata")
        const rs_json = await rs.json()
        console.log(rs_json.data)
        setLocations(rs_json.data)
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้งในภายหลัง");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
    // const headers = [
    //   "Date",
    //   "Hour",
    //   "Temperature(°C)",
    //   "Humidity(%)",
    //   "SLP",
    //   "Rain(mm)",
    //   "Windspeed10m(m/s)",
    //   "WindDirection10m",
    //   "LowCloud",
    //   "HighCloud",
    // ];

  const Date_data = async (name_location: string) => {
    try{
      const rs = await fetch(`https://cass-api-data.vercel.app/api/climate/${name_location}`)
      const rs_json = await rs.json()
      const rs_finond = rs_json.flatMap((m: any) => m.meteorological_id);
  
      setProvince(rs_finond);
    }catch(err: any){
      console.error(err)
    }
  }

  const availableDates: Date[] = province.map((item) => {
    return new Date(item.year, item.month - 1, item.day)
  })

  const Day_data = async () => {
    try{
       if(idlocation === 0){
            alert("กรุณาหรอกข้อมูลให้ครบหน่อยครับ/ค่ะ")
        }else if(!selectedDate){
            alert("กรุณาใส่ข้อมูลเวลาที่ต้องการหน่อยครับ/ค่ะ")
        }else{
          const rs = await fetch(`https://cass-api-data.vercel.app/api/climate/${selectedDate?.getFullYear()}/${selectedDate?.getMonth()! + 1}/${selectedDate?.getDate()}/${pushnamelocation}`)
          const rs_json = await rs.json()
          setLocation_day(rs_json)
          setLocation_month([])
          setLocation_year([])
        }
    }catch(err){
      console.error(err)
    }
  }

    const Month_data = async () => {
    try{
       if(idlocation === 0){
            alert("กรุณาหรอกข้อมูลให้ครบหน่อยครับ/ค่ะ")
        }else if(!selectedDate){
            alert("กรุณาใส่ข้อมูลเวลาที่ต้องการหน่อยครับ/ค่ะ")
        }else{
          const rs = await fetch(`https://cass-api-data.vercel.app/api/climate/${selectedDate?.getFullYear()}/${selectedDate?.getMonth()! + 1}/${pushnamelocation}`)
          const rs_json = await rs.json()
          setLocation_month(rs_json)
          setLocation_day([])
          setLocation_year([])
        }
    }catch(err){
      console.error(err)
    }
  }

      const Year_data = async () => {
    try{
      const rs = await fetch(`https://cass-api-data.vercel.app/api/climate/${selectedDate?.getFullYear()}/${pushnamelocation}`)
      const rs_json = await rs.json()
      setLocation_year(rs_json)
      setLocation_day([])
      setLocation_month([])
    }catch(err){
      console.error(err)
    }
  }

  const downloadCSV = (data: LocationData[], title: string) => {
    if (data.length === 0) {
      alert("ไม่มีข้อมูลสำหรับดาวน์โหลด");
      return;
    }

    const headers = [
      "สถานที่",
      "รหัสสถานที่",
      "วันเวลา",
      "High Cloud",
      "Humidity",
      "Low Cloud",
      "Rain",
      "SLP",
      "Temperature",
      "Wind Direction"
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));

    data.forEach((item) => {
      item.meteorological_id.forEach((met) => {
        const row = [
          item.name_location,
          item.id,
          met.day,
          met.highcloud,
          met.humidity,
          met.lowcloud,
          met.rain,
          met.slp,
          met.temperaturde,
          met.winddirdedtion10m
        ];
        csvRows.push(row.join(","));
      });
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const CheckTokenModal = ({open, onChange, data, tile}: any) => {
    const [tokenValue, setTokenValue] = useState("");
    const token = localStorage.getItem("token");
    const tokenOk = localStorage.getItem("tokenOk");
    console.log(token, open, tokenOk, tokenOk === token)
    useEffect(() => {
      if(open && token && tokenOk === token){
        downloadCSV(data, tile);
        onChange()
      }
    },[open])

    const token_api = async(tokenValue: string) => {
      try{
        const rs = await fetch(`http://localhost:3005/api/user-token/${tokenValue}`)
        const rs_json = await rs.json();
        if(rs_json.status === "success"){
          alert("โทเคนถูกต้อง");
          localStorage.setItem("token", tokenValue);
          localStorage.setItem("tokenOk", tokenValue);
          downloadCSV(data, tile);
          onChange();
        }
      }catch(err){
        console.error("Error fetching token:", err); 
      }
    }

    const confirmToken = () => {
    if (!tokenValue) {
      alert("กรุณาใส่โทเคนก่อนยืนยัน");
      return;
    }
    if (tokenValue !== token) {
      if(!token){
        token_api(tokenValue)
      }else{
        alert("โทเคนไม่ถูกต้อง");
        return;
      }
    }
    alert("ยืนยันโทเคนสำเร็จ");
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("tokenOk", tokenValue);
    downloadCSV(data, tile);
  };
    return(
      <Modal
          open={open}
          onClose={onChange}
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

            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" color="secondary" onClick={onChange}>
                ออก
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<ContentCopyIcon />}
                onClick={confirmToken}
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

    )
  }

const renderStyledTable = (data: LocationData[], title: string) => (
  <div className="my-8">
    <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">{title}</h2>
  <div className="text-center mb-4">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        onClick={() => downloadCSV(data, title)}
      >
        <FaDownload className="inline mr-2" />
        ดาวน์โหลด CSV
      </button>
      </div>
      <div>
        <button onClick={() => setTockenstatus(prev => !prev)}> Token</button>
        <CheckTokenModal 
        open={tockenstatus}
        onChange={() => setTockenstatus(false)}
        data={data}
        tile={title}
        />
      </div>
    {data.map((item) => (
      <div key={item.id} className="mb-6 border rounded-lg shadow-md overflow-x-auto">
        <div className="bg-gray-100 p-4">
          <p className="font-semibold">สถานที่: {item.name_location}</p>
          <p className="text-sm text-gray-600">รหัสสถานที่: {item.id}</p>
        </div>

        <table className="w-full table-fixed bg-white text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-2 px-4 border w-12">วันเวลา</th>
              <th className="py-2 px-4 border w-16">High Cloud</th>
              <th className="py-2 px-4 border w-20">Humidity</th>
              <th className="py-2 px-4 border w-14">Low Cloud</th>
              <th className="py-2 px-4 border w-14">Rain</th>
              <th className="py-2 px-4 border w-20">SLP</th>
              <th className="py-2 px-4 border w-16">Temperature</th>
              <th className="py-2 px-4 border w-16">Wind Direction</th>
            </tr>
          </thead>
          <tbody>
            {item.meteorological_id.map((met) => (
              <tr key={met.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border text-center">{met.day}</td>
                <td className="py-2 px-4 border text-center">{met.highcloud}</td>
                <td className="py-2 px-4 border text-center">{met.humidity}</td>
                <td className="py-2 px-4 border text-center">{met.lowcloud}</td>
                <td className="py-2 px-4 border text-center">{met.rain}</td>
                <td className="py-2 px-4 border text-center">{met.slp}</td>
                <td className="py-2 px-4 border text-center">{met.temperaturde}</td>
                <td className="py-2 px-4 border text-center">{met.winddirdedtion10m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
<div className="px-4 py-10 bg-gray-50 min-h-screen flex flex-col items-center">
  <div className="w-full max-w-6xl space-y-8">

    <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 shadow-md">
      <div className="flex-1">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">เลือกสถานที่ตรวจวัด</label>
        <select
          id="location"
          className="w-full border border-gray-300 rounded-md p-2 mt-2"
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            setIdlocation(selectedId)
            const locationCheckId = locations.find((item) => item.id === selectedId);
            if (locationCheckId) {
              Date_data(locationCheckId.locationaname);
              setPushnamelocation(locationCheckId.locationaname);
            }
          }}
        >
          <option value="">--เลือกสถานที่ตรวจวัด--</option>
          {locations.map((location) => (
            <option value={location.id} key={location.id}>{location.locationaname}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="datePicker" className="block text-sm font-medium text-gray-700 ">เลือกวัน</label>
        <DatePicker
          id="datePicker"
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          includeDates={availableDates}
          placeholderText="เลือกวันที่"
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <button
          className="w-36 ml-2.5 bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-md p-2 mt-4"
          onClick={Day_data}
        >
          ค้นหา
        </button>
      </div>
    </div>

    {/* ปุ่มรายวัน รายเดือน รายปี */}
    <div className="flex flex-wrap justify-center gap-4">
      <button
        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        onClick={Day_data}
      >
        ข้อมูลรายวัน
      </button>
      <button
        className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        onClick={Month_data}
      >
        ข้อมูลรายเดือน
      </button>
      <button
        className="bg-pink-700 hover:bg-pink-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        onClick={Year_data}
      >
        ข้อมูลรายปี
      </button>
    </div>

    {/* ตารางข้อมูลผลลัพธ์ */}
    <div className="space-y-12">
      {location_day.length > 0 && renderStyledTable(location_day, "ข้อมูลรายวัน")}
      {location_month.length > 0 && renderStyledTable(location_month, "ข้อมูลรายเดือน")}
      {location_year.length > 0 && renderStyledTable(location_year, "ข้อมูลรายปี")}
    </div>
  </div>
</div>


  );
};

export default DownloadPage;