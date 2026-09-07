function CreditCard({
    icon,
    label,
    value,
    description,
    cardClass = "",
    iconClass = "",
  }) {
    return (
      <div
        className={`rounded-[22px] border p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] ${cardClass}`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </div>
  
          <span className="text-[28px] font-bold tracking-[-0.05em] text-[var(--text)]">
            {value}
          </span>
        </div>
  
        <p className="mt-4 text-[10px] font-bold text-[var(--text)]">
          {label}
        </p>
  
        <p className="mt-1 text-[8px] text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    );
  }
  
  export default CreditCard;