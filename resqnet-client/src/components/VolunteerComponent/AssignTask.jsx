import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../api/apiservice";
import { Button, Table, Modal } from "flowbite-react";
import { FaArrowLeft } from "react-icons/fa";

const AssignTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volunteerId, setVolunteerId] = useState(null);
  const [volunteerArea, setVolunteerArea] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [fullname, setFullname] = useState("");

  useEffect(() => {
    const fetchVolunteerDetails = async (id) => {
      try {
        const res = await fetch(`${BASE_URL}/api/user/get/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setVolunteerArea(data.area);
          setFullname(data.fullName);
        } else {
          console.error("Failed to fetch volunteer details:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching volunteer details:", error.message);
      }
    };

    const url = window.location.href;
    const idIndex = url.lastIndexOf("/");
    const extractedId = idIndex !== -1 ? url.substring(idIndex + 1) : null;
    setVolunteerId(extractedId);

    if (extractedId) fetchVolunteerDetails(extractedId);

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/volunteers/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
        console.log("Fetched tasks:", data.tasks);
        setLoading(false);
      } else {
        console.error("Failed to fetch tasks:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const handleAssignClick = (task) => {
    setSelectedTask(task);
    setShowConfirmationModal(true);
  };

  const handleConfirmAssign = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/volunteers/tasks/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          taskId: selectedTask._id,
          volunteerId: volunteerId,
        }),
      });
      if (res.ok) {
        console.log("Task assigned successfully");
        setShowSuccessModal(true);
        fetchTasks();
      } else {
        console.error("Failed to assign task:", res.statusText);
      }
    } catch (error) {
      console.error("Error assigning task:", error.message);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  return (
    <div className="p-4">
      <Button
        color="gray"
        className="flex items-center mb-4"
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className="mr-2" /> Back
      </Button>
      <h2 className="text-2xl font-bold mb-6 text-center">Assign Task</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <Table hoverable className="shadow-md rounded">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Location</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {tasks.map((task) => (
                <Table.Row key={task._id} className="hover:bg-gray-100">
                  <Table.Cell>{task.name}</Table.Cell>
                  <Table.Cell>{task.description}</Table.Cell>
                  <Table.Cell
                    className={
                      volunteerArea && task.area === volunteerArea
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {volunteerArea && task.area === volunteerArea
                      ? "Same Location"
                      : task.area}
                  </Table.Cell>
                  <Table.Cell>
                    {task.assignedVolunteer ? (
                      <Button color="gray" disabled size="sm">
                        Assigned
                      </Button>
                    ) : (
                      <Button
                        color="blue"
                        size="sm"
                        onClick={() => handleAssignClick(task)}
                      >
                        Assign
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Confirmation Modal */}
          <Modal
            show={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            popup
          >
            <Modal.Header>Confirmation</Modal.Header>
            <Modal.Body>
              Are you sure you want to assign "{selectedTask?.name}" to{" "}
              <strong>{fullname}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button color="green" onClick={handleConfirmAssign}>
                Yes
              </Button>
              <Button
                color="gray"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Success Modal */}
          <Modal
            show={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            popup
          >
            <Modal.Header>Success</Modal.Header>
            <Modal.Body>Task assigned successfully!</Modal.Body>
            <Modal.Footer>
              <Button
                color="green"
                onClick={() => setShowSuccessModal(false)}
              >
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AssignTask;
