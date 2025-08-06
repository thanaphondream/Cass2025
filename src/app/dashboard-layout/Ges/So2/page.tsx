// So2_.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Import the new chart components
import DailySo2BarChart from "./DailySo2BarChart";
import MonthlySo2BarChart from "./MonthlySo2BarChart";
import YearlySo2BarChart from "./YearlySo2BarChart";

interface So2 {
  id: number; // Added id for consistency, assuming it exists
  so2_name: string; // Changed from no2_name to so2_name as per your chart components
  so2: number; // Changed from no2 to so2 as per your chart components
  o3: number;
  aod: number;
  flag: number;
}

interface Ges {
  id: number;
  year: number;
  month: number;
  day: number;
  hours: number;
  so2_id: So2[];
}

interface Location {
  id: number;
  name_location: string;
  latitude: number;
  longitude: number;
  ges_id?: Ges[];
}

const So2_ = () => {
  const [locationdat, setLocationsData] = useState<Location[]>([]);
  const [locationShowall, setLocationsShowall] = useState<Location[]>([]); // Daily data
  const [locationShowdatamonth, setLocationShowDataMonth] = useState<Location[]>([]); // Monthly data
  const [locationShowdatayaer, setLocationShowDataYaer] = useState<Location[]>([]); // Yearly data
  const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);
  const [gesData, setGesData] = useState<Ges[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingGesData, setLoadingGesData] = useState(false);
  const [errorLocations, setErrorLocations] = useState<string | null>(null);
  const [errorGesData, setErrorGesData] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("day");
  const [showChart, setShowChart] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const rs = await fetch('http://localhost:3005/api/location');
        if (!rs.ok) throw new Error(`HTTP error! status: ${rs.status}`);
        const rs_json: Location[] = await rs.json();
        setLocationsData(rs_json);
        if (rs_json.length > 0) {
          setSelectedLocationName(rs_json[0].name_location);
        }
      } catch (err: any) {
        console.error("Error fetching locations:", err);
        setErrorLocations(`Failed to load locations: ${err.message}`);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchGesData = async () => {
      if (selectedLocationName) {
        try {
          setLoadingGesData(true);
          setErrorGesData(null);
          const encodedLocationName = encodeURIComponent(selectedLocationName);
          const rs = await fetch(`http://localhost:3005/api/gesso2/${encodedLocationName}`);
          if (!rs.ok) throw new Error(`HTTP error! status: ${rs.status}`);
          const rs_json: Ges[] = await rs.json();
          setGesData(rs_json);
          if (rs_json.length > 0 && !selectedDate) {
            const firstDate = new Date(rs_json[0].year, rs_json[0].month - 1, rs_json[0].day);
            setSelectedDate(firstDate);
          }
        } catch (err: any) {
          console.error("Error fetching GES data:", err);
          setErrorGesData(`Failed to load data for ${selectedLocationName}: ${err.message}`);
          setGesData([]);
          setSelectedDate(null);
        } finally {
          setLoadingGesData(false);
        }
      }
    };
    fetchGesData();
  }, [selectedLocationName]);

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocationName(event.target.value);
    setSelectedDate(null); 
    setShowChart(false); 
  };

  const availableDates = useMemo(() => {
    return gesData.map(data => new Date(data.year, data.month - 1, data.day));
  }, [gesData]);

  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      availableDate =>
        availableDate.getFullYear() === date.getFullYear() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getDate() === date.getDate()
    );
  };

  // Fetch daily data when selectedDate or selectedLocationName changes
  useEffect(() => {
    const showallSo2 = async () => {
      if (!selectedDate || !selectedLocationName) {
        setLocationsShowall([]);
        return;
      }

      const selectedLocation = locationdat.find(loc => loc.name_location === selectedLocationName);
      if (!selectedLocation) {
        setLocationsShowall([]);
        return;
      }

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();

      try {
        const rs = await fetch(`http://localhost:3005/api/gesso2/${year}/${month}/${day}/${selectedLocation.id}`);
        if (!rs.ok) throw new Error(`HTTP error! status: ${rs.status}`);
        const rs_json = await rs.json();
        setLocationsShowall(rs_json);
      } catch (err) {
        console.error("Error fetching daily data:", err);
        setLocationsShowall([]);
      }
    };
    if (viewMode === "day") {
        showallSo2();
    } else {
        setLocationsShowall([]);
    }
  }, [selectedDate, selectedLocationName, locationdat, viewMode]);


  // Function to fetch monthly data
  const Data_month_so2 = async () => {
    if (!selectedDate || !selectedLocationName) {
        setLocationShowDataMonth([]);
        return;
    }
    try {
      const selectedLocation = locationdat.find(loc => loc.name_location === selectedLocationName);
      if (!selectedLocation) {
          setLocationShowDataMonth([]);
          return;
      }
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const rs = await fetch(`http://localhost:3005/api/gesso2/${year}/${month}/${selectedLocation.id}`);
      const rs_json = await rs.json();
      setLocationShowDataMonth(rs_json);
    } catch (err) {
      console.error("Error fetching monthly data:", err);
      setLocationShowDataMonth([]);
    }
  };

  // Function to fetch yearly data
  const Data_year_so2 = async () => {
    if (!selectedDate || !selectedLocationName) {
        setLocationShowDataYaer([]);
        return;
    }
    try {
      const selectedLocation = locationdat.find(loc => loc.name_location === selectedLocationName);
      if (!selectedLocation) {
          setLocationShowDataYaer([]);
          return;
      }
      const year = selectedDate.getFullYear();
      const rs = await fetch(`http://localhost:3005/api/gesso2/${year}/${selectedLocation.id}`);
      const rs_json = await rs.json();
      setLocationShowDataYaer(rs_json);
    } catch (err) {
      console.error("Error fetching yearly data:", err);
      setLocationShowDataYaer([]);
    }
  };

  useEffect(() => {
    setShowChart(false); 
    if (viewMode === "month") {
      Data_month_so2();
    } else if (viewMode === "year") {
      Data_year_so2();
    }
  }, [viewMode, selectedDate, selectedLocationName, locationdat]);

  const handleToggleChart = () => {
    setShowChart(prev => !prev);
  };

  const exportToCsv = (data: Location[], filename: string) => {
    if (!data || data.length === 0) {
      alert("No data to export!");
      return;
    }

    let csvContent = "Location,Year,Month,Day,Hour,SO2,O3,AOD,Flag\n";

    data.forEach(location => {
      location.ges_id?.forEach(ges => {
        ges.so2_id?.forEach(so2 => {
          csvContent += `${location.name_location},${ges.year},${ges.month},${ges.day},${ges.hours},${so2.so2},${so2.o3},${so2.aod},${so2.flag}\n`;
        });
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 text-center">
          เลือกช่วงเวลาและสถานีข้อมูลคุณภาพอากาศ SO2
        </h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          {/* Location Dropdown */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <label htmlFor="location-select" className="block text-gray-700 text-sm font-bold mb-2">
              เลือกสถานที่:
            </label>
            {loadingLocations ? (
              <select
                id="location-select"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500
                           text-lg text-gray-700 bg-white appearance-none pr-10
                           hover:border-gray-400 transition-colors duration-200"
                disabled
              >
                <option value="" disabled>กำลังโหลดสถานที่...</option>
              </select>
            ) : errorLocations ? (
              <select
                id="location-select"
                className="w-full px-5 py-3 border border-red-400 rounded-lg shadow-sm
                           focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500
                           text-lg text-red-700 bg-white appearance-none pr-10"
                disabled
              >
                <option value="" disabled>{errorLocations}</option>
              </select>
            ) : (
              <select
                id="location-select"
                value={selectedLocationName || ""}
                onChange={handleLocationChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500
                           text-lg text-gray-700 bg-white appearance-none pr-10
                           hover:border-gray-400 transition-colors duration-200"
              >
                <option value="">--เลือกสถานที่--</option>
                {locationdat.map((item) => (
                  <option value={item.name_location} key={item.id} className="text-gray-700">
                    {item.name_location}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date Picker */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <label htmlFor="datePicker" className="block text-gray-700 text-sm font-bold mb-2">
              เลือกวันที่:
            </label>
            {loadingGesData ? (
              <input
                type="text"
                value="กำลังโหลดข้อมูลวันที่..."
                disabled
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm
                           text-lg text-gray-500 bg-gray-50 pr-10"
              />
            ) : errorGesData ? (
              <input
                type="text"
                value={errorGesData}
                disabled
                className="w-full px-5 py-3 border border-red-400 rounded-lg shadow-sm
                           text-lg text-red-700 bg-red-50 pr-10"
              />
            ) : (
              <DatePicker
                id="datePicker"
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                  setShowChart(false);
                }}
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                includeDates={availableDates}
                filterDate={isDateAvailable}
                placeholderText="เลือกวันที่"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500
                           text-lg text-gray-700 bg-white appearance-none pr-10
                           hover:border-gray-400 transition-colors duration-200"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6 mb-8">
        <button
          onClick={() => setViewMode("day")}
          className={`px-6 py-3 rounded-lg shadow-md transition-colors duration-200 text-lg font-semibold
                      ${viewMode === "day" ? "bg-blue-600 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          ข้อมูลรายวัน
        </button>
        <button
          onClick={() => setViewMode("month")}
          className={`px-6 py-3 rounded-lg shadow-md transition-colors duration-200 text-lg font-semibold
                      ${viewMode === "month" ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600"}`}
        >
          ข้อมูลรายเดือน
        </button>
        <button
          onClick={() => setViewMode("year")}
          className={`px-6 py-3 rounded-lg shadow-md transition-colors duration-200 text-lg font-semibold
                      ${viewMode === "year" ? "bg-purple-600 text-white" : "bg-purple-500 text-white hover:bg-purple-600"}`}
        >
          ข้อมูลรายปี
        </button>
      </div>

      {selectedLocationName && selectedDate && (
        <div className="flex justify-center mt-6 mb-8">
          <button
            onClick={handleToggleChart}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-200 text-lg font-semibold"
          >
            {showChart ? "ซ่อนกราฟ" : "แสดงกราฟ"}
          </button>
        </div>
      )}

      {selectedLocationName && selectedDate ? (
        <>
          {viewMode === "day" && (
            <>
              {locationShowall.length > 0 ? (
                <>
                  {showChart && (
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                      <DailySo2BarChart dataSource={locationShowall} />
                    </div>
                  )}
                  <div className="mt-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">ตารางข้อมูล SO2 รายชั่วโมง</h2>
                    <div className="flex justify-center mb-4">
                      <button
                        onClick={() => exportToCsv(locationShowall, `${selectedLocationName}_daily_SO2_${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}.csv`)}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                      >
                        ดาวน์โหลดข้อมูลรายวัน (.csv)
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-300">
                      <table className="min-w-full bg-white text-left text-sm">
                        <thead className="bg-gray-100 uppercase">
                          <tr>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Location</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Year</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Month</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Day</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Hour</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">SO2</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">O3</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">AOD</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Flag</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locationShowall.map((loc) => (
                            loc.ges_id?.map((ges) => (
                              ges.so2_id?.map((s2) => (
                                <tr key={`${loc.id}-${ges.id}-${s2.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-2 px-4">{loc.name_location}</td>
                                  <td className="py-2 px-4">{ges.year}</td>
                                  <td className="py-2 px-4">{ges.month}</td>
                                  <td className="py-2 px-4">{ges.day}</td>
                                  <td className="py-2 px-4">{ges.hours}</td>
                                  <td className="py-2 px-4">{s2.so2}</td>
                                  <td className="py-2 px-4">{s2.o3}</td>
                                  <td className="py-2 px-4">{s2.aod}</td>
                                  <td className="py-2 px-4">{s2.flag}</td>
                                </tr>
                              ))
                            ))
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-8 text-center text-xl text-gray-600 p-6 bg-white rounded-lg shadow-md">ไม่มีข้อมูล SO2 รายวันสำหรับวันที่เลือก</p>
              )}
            </>
          )}

          {/* Monthly View */}
          {viewMode === "month" && (
            <>
              {locationShowdatamonth.length > 0 ? (
                <>
                  {showChart && (
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                      <MonthlySo2BarChart dataSource={locationShowdatamonth} />
                    </div>
                  )}
                  <div className="mt-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">ตารางข้อมูล SO2 รายเดือน</h2>
                    <div className="flex justify-center mb-4">
                      <button
                        onClick={() => exportToCsv(locationShowdatamonth, `${selectedLocationName}_monthly_SO2_${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}.csv`)}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                      >
                        ดาวน์โหลดข้อมูลรายเดือน (.csv)
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-300">
                      <table className="min-w-full bg-white text-left text-sm">
                        <thead className="bg-gray-100 uppercase">
                          <tr>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Location</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Year</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Month</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Day</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Hour</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">SO2</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">O3</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">AOD</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Flag</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locationShowdatamonth.map((loc) => (
                            loc.ges_id?.map((ges) => (
                              ges.so2_id?.map((s2) => (
                                <tr key={`${loc.id}-${ges.id}-${s2.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-2 px-4">{loc.name_location}</td>
                                  <td className="py-2 px-4">{ges.year}</td>
                                  <td className="py-2 px-4">{ges.month}</td>
                                  <td className="py-2 px-4">{ges.day}</td>
                                  <td className="py-2 px-4">{ges.hours}</td>
                                  <td className="py-2 px-4">{s2.so2}</td>
                                  <td className="py-2 px-4">{s2.o3}</td>
                                  <td className="py-2 px-4">{s2.aod}</td>
                                  <td className="py-2 px-4">{s2.flag}</td>
                                </tr>
                              ))
                            ))
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-8 text-center text-xl text-gray-600 p-6 bg-white rounded-lg shadow-md">ไม่มีข้อมูล SO2 รายเดือนสำหรับเดือนที่เลือก</p>
              )}
            </>
          )}

          {/* Yearly View */}
          {viewMode === "year" && (
            <>
              {locationShowdatayaer.length > 0 ? (
                <>
                  {showChart && (
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                      <YearlySo2BarChart dataSource={locationShowdatayaer} />
                    </div>
                  )}
                  <div className="mt-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">ตารางข้อมูล SO2 รายปี</h2>
                    <div className="flex justify-center mb-4">
                      <button
                        onClick={() => exportToCsv(locationShowdatayaer, `${selectedLocationName}_yearly_SO2_${selectedDate.getFullYear()}.csv`)}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                      >
                        ดาวน์โหลดข้อมูลรายปี (.csv)
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-300">
                      <table className="min-w-full bg-white text-left text-sm">
                        <thead className="bg-gray-100 uppercase">
                          <tr>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Location</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Year</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Month</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Day</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Hour</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">SO2</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">O3</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">AOD</th>
                            <th className="py-3 px-4 border-b text-gray-600 font-semibold">Flag</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locationShowdatayaer.map((loc) => (
                            loc.ges_id?.map((ges) => (
                              ges.so2_id?.map((s2) => (
                                <tr key={`${loc.id}-${ges.id}-${s2.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-2 px-4">{loc.name_location}</td>
                                  <td className="py-2 px-4">{ges.year}</td>
                                  <td className="py-2 px-4">{ges.month}</td>
                                  <td className="py-2 px-4">{ges.day}</td>
                                  <td className="py-2 px-4">{ges.hours}</td>
                                  <td className="py-2 px-4">{s2.so2}</td>
                                  <td className="py-2 px-4">{s2.o3}</td>
                                  <td className="py-2 px-4">{s2.aod}</td>
                                  <td className="py-2 px-4">{s2.flag}</td>
                                </tr>
                              ))
                            ))
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-8 text-center text-xl text-gray-600 p-6 bg-white rounded-lg shadow-md">ไม่มีข้อมูล SO2 รายปีสำหรับปีที่เลือก</p>
              )}
            </>
          )}
        </>
      ) : (
        <p className="mt-8 text-center text-xl text-gray-700 p-6 bg-white rounded-lg shadow-md">
          กรุณาเลือกสถานที่และวันที่เพื่อแสดงข้อมูล
        </p>
      )}
    </div>
  );
};

export default So2_;