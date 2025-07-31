import React, { useEffect, useState } from "react";

interface AccordionCardProps {
  title: string;
  children: React.ReactNode;
  open?: boolean; // ahora es controlada
  onToggle?: () => void;
}

const AccordionCard: React.FC<AccordionCardProps> = ({ title, children, open = false, onToggle }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle();
  };

  return (
    <div className="card mb-3">
      <div
        className="card-header d-flex justify-content-between align-items-center"
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
      >
        <h3 className="card-title mb-0">{title}</h3>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div className="card-body">{children}</div>}
    </div>
  );
};

export default AccordionCard;
