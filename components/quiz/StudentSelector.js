import React from "react";

const StudentSelector = ({
  students,
  selectedStudent,
  competitiveTriesLeft,
  onStudentChange,
  disabled,
  scoreField = "score",
}) => {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
      <label
        htmlFor="student-select"
        className="block mb-1 text-center font-semibold text-red-800">
        Select Student:
      </label>
      <select
        id="student-select"
        value={selectedStudent ? selectedStudent.id : ""}
        onChange={onStudentChange}
        disabled={disabled}
        className={`w-full p-2 border border-red-300 rounded focus:ring-2 focus:ring-red-400 focus:border-red-400 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}>
        <option value="">-- Select a student --</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.first_name} {student.last_name} (HS:{" "}
            {student[scoreField] ?? 0})
          </option>
        ))}
        {students.length === 0 && (
          <option disabled>Loading students...</option>
        )}
      </select>
      {selectedStudent && (
        <p className="mt-2 text-center text-sm text-red-700 font-medium">
          Tries Left:{" "}
          <span className="font-bold">{competitiveTriesLeft}</span>
          {competitiveTriesLeft <= 0 && " (Switch modes or student)"}
        </p>
      )}
    </div>
  );
};

export default StudentSelector;
