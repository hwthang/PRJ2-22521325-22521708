import { CustomLabel } from "../../feature/component/custom/CustomLabel";

export const CheckOption = ({
  options = {},
  value = [],
  onChange = () => {},
  disabled = false,
  multiple = true,
}) => {
  const isSelected = (key) =>
    Array.isArray(value) ? value.includes(key) : value === key;

  const handleClick = (key) => {
    if (disabled) return;

    if (multiple) {
      onChange(
        isSelected(key)
          ? value.filter((v) => v !== key)
          : [...value, key]
      );
    } else {
      onChange(isSelected(key) ? [] : [key]);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap text-sm">
      {Object.entries(options).map(([key, opt]) => (
        <CustomLabel
          key={key}
          label={opt.label}
          color={opt.color}
          icon={opt.icon}
          selected={isSelected(key)}
          disabled={disabled}
          clickable={!disabled}
          onClick={() => handleClick(key)}
        />
      ))}
    </div>
  );
};
