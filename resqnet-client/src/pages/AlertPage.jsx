import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../api/apiservice";
import { toast, ToastContainer } from "react-toastify";
import { SocketContext } from "../context/SocketContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Table,
  Modal,
  TextInput,
  Button,
  Label,
  Select,
  Pagination,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashSidebar from "../components/DashSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend
);

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    message: "",
    location: "",
    severity: "low",
    status: "open",
  });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertsPerPage] = useState(5);



  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const onPageChange = (page) => {
  console.log("📄 Changing to page:", page); // Debug
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: "smooth" }); // optional: scroll to top
};

  useEffect(() => {
    fetchAlerts();

    socket.on("newAlert", (alert) => {
      setAlerts((prevAlerts) => [alert, ...prevAlerts]);
    });

    return () => {
      socket.off("newAlert");
    };
  }, [socket]);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    const severityCount = countSeverity();
    const data = generateData(severityCount);
    const options = generateOptions();

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ChartJS(ctx, {
      type: "bar",
      data,
      options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [alerts]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/alerts/`);
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const countSeverity = () => {
    const severityCount = {
      low: 0,
      medium: 0,
      high: 0,
    };

    alerts.forEach((alert) => {
      severityCount[alert.severity]++;
    });

    return severityCount;
  };

  const generateData = (severityCount) => {
    return {
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          label: "Alert Severity",
          data: [severityCount.low, severityCount.medium, severityCount.high],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
        },
      ],
    };
  };

  const generateOptions = () => {
    return {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          type: "category",
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label;
              const value = context.raw;
              return `${label}: ${value}`;
            },
          },
        },
      },
    };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/alerts/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        toast.success("Alert created successfully!");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Failed to create alert!");
    }
  };

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col p-4 md:p-8 w-full md:w-3/4 mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="relative mb-6">
        {currentUser.user.role === "admin" && (
          <Button
            className="absolute top-0 right-0 mt-2 sm:mt-4 sm:mb-5 sm:mr-4"
            size="sm"
            onClick={handleOpenModal}
            color="primary"
          >
            Add Alert
          </Button>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Alerts</h1>
      <div
        className="chart-container mx-auto w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-6"
        style={{ height: "300px" }}
      >
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
  


{alerts.length > 0 ? (
<div className="overflow-x-auto mb-6">
  <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg shadow-md bg-white">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="px-4 py-2 text-left font-semibold">Type</th>
        <th className="px-4 py-2 text-left font-semibold">Message</th>
        <th className="px-4 py-2 text-left font-semibold">Location</th>
        <th className="px-4 py-2 text-left font-semibold">Severity</th>
        <th className="px-4 py-2 text-left font-semibold">Status</th>
        <th className="px-4 py-2 text-left font-semibold">Time</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {currentAlerts.map((alert) => (
        <tr key={alert.id} className="hover:bg-gray-50">
          <td className="px-4 py-2 font-medium">{alert.type}</td>
          <td className="px-4 py-2">{alert.message}</td>
          <td className="px-4 py-2">{alert.location}</td>
          <td className="px-4 py-2 uppercase">{alert.severity}</td>
          <td className="px-4 py-2">{alert.status}</td>
          <td className="px-4 py-2">{formatTimestamp(alert.timestamp)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



) : (
  <p className="text-center text-gray-500 my-8">
    No alerts to display.
  </p>
)}
</div>

    
  <div className="flex justify-center space-x-2 mt-4">
    <Button
      className="px-2 py-1 border rounded bg-gray-100"
      color="red"
      size="sm"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <span className="px-2 py-1 border rounded bg-gray-100">
      Page {currentPage} of {Math.ceil(alerts.length / alertsPerPage)}
    </span>
    <Button
      className="px-2 py-1 border rounded bg-gray-100"
      color="red"
      size="sm"
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, Math.ceil(alerts.length / alertsPerPage))
        )
      }
      disabled={currentPage === Math.ceil(alerts.length / alertsPerPage)}
    >
      Next
    </Button>

  </div>


      <Modal show={isModalOpen} onClose={handleCloseModal} size="lg">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <Modal.Header className="text-xl font-semibold">
            Add Alert
          </Modal.Header>
          <Modal.Body className="overflow-y-auto flex-grow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="mb-2">
                <Label htmlFor="type" value="Type" />
                <TextInput
                  id="type"
                  name="type"
                  color="gray"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-2">
                <Label htmlFor="message" value="Message" />
                <TextInput
                  id="message"
                  name="message"
                  color="gray"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-2">
                <Label htmlFor="location" value="Location" />
                <TextInput
                  id="location"
                  name="location"
                  color="gray"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-2">
                <Label htmlFor="severity" value="Severity" />
                <Select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>
              <div className="mb-2">
             <Label htmlFor="status" value="Status" />
               <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                color="gray"
               >
               <option value="open">Open</option>
               <option value="closed">Closed</option>
              </Select>
             </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-end space-x-2 p-4">
            <Button
              type="submit"
              color="green"
              className="w-full"
            >
              Submit
            </Button>
            <Button
             color="gray"
             onClick={handleCloseModal}
            >
            Cancel
            </Button>
          </Modal.Footer>

        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AlertPage;
