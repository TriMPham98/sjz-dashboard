import { useState, useEffect, useCallback } from "react";
import { DEFAULT_COMPETITIVE_TRIES, PASSWORD } from "./quizConstants";

export default function useStudentManagement({
  scoreField = "score",
  onStudentSelected,
  onStudentDeselected,
} = {}) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [tempStudentSelection, setTempStudentSelection] = useState(null);
  const [competitiveTriesLeft, setCompetitiveTriesLeft] = useState(
    DEFAULT_COMPETITIVE_TRIES
  );

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch("/api/checkUsers");
      if (!response.ok)
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      const data = await response.json();
      setStudents(
        Array.isArray(data)
          ? data.sort((a, b) => (b[scoreField] ?? 0) - (a[scoreField] ?? 0))
          : []
      );
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [scoreField]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStudentChange = useCallback(
    (e, { isActive, onReset } = {}) => {
      const newStudentIdString = e.target.value;
      if (!newStudentIdString) {
        setSelectedStudent(null);
        setTempStudentSelection(null);
        setShowPasswordPopup(false);
        if (isActive && onReset) onReset();
        if (onStudentDeselected) onStudentDeselected();
        return;
      }
      const newStudentId = parseInt(newStudentIdString);
      const student = students.find((s) => s.id === newStudentId);
      if (student && student.id !== selectedStudent?.id) {
        setTempStudentSelection(student);
        setShowPasswordPopup(true);
      }
    },
    [selectedStudent, students, onStudentDeselected]
  );

  const handlePasswordSubmit = useCallback(
    (password, { onSuccess } = {}) => {
      if (password === PASSWORD) {
        setSelectedStudent(tempStudentSelection);
        setShowPasswordPopup(false);
        setCompetitiveTriesLeft(DEFAULT_COMPETITIVE_TRIES);
        if (onSuccess) onSuccess(tempStudentSelection);
        setTempStudentSelection(null);
      } else {
        alert("Incorrect password");
      }
    },
    [tempStudentSelection]
  );

  const handlePasswordCancel = useCallback(() => {
    setShowPasswordPopup(false);
    setTempStudentSelection(null);
    const dropdown = document.getElementById("student-select");
    if (dropdown) {
      dropdown.value = selectedStudent ? selectedStudent.id : "";
    }
  }, [selectedStudent]);

  const decrementTries = useCallback(() => {
    const newTries = Math.max(0, competitiveTriesLeft - 1);
    setCompetitiveTriesLeft(newTries);
    return newTries;
  }, [competitiveTriesLeft]);

  const resetTries = useCallback(() => {
    setCompetitiveTriesLeft(DEFAULT_COMPETITIVE_TRIES);
  }, []);

  return {
    students,
    setStudents,
    selectedStudent,
    setSelectedStudent,
    showPasswordPopup,
    tempStudentSelection,
    competitiveTriesLeft,
    setCompetitiveTriesLeft,
    handleStudentChange,
    handlePasswordSubmit,
    handlePasswordCancel,
    fetchStudents,
    decrementTries,
    resetTries,
  };
}
