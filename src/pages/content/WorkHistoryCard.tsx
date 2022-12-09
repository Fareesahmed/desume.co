import { WorkExperience } from "../../common/interfaces/resume";

interface WorkHistoryCardProps {
  experience: WorkExperience;
}

const WorkHistoryCard: React.FC<WorkHistoryCardProps> = ({ experience }) => {
  return (
    <div className="border sm:overflow-hidden sm:rounded-md">
      <div className="bg-white">
        <div className="grid grid-cols-3">
          <div className="p-4 flex flex-col border-r">
            <span className="font-medium text-gray-900">
              {experience.companyName}
            </span>

            <span className="font-normal text-gray-700">
              {experience.jobTitle}
            </span>

            <span className="mt-1 text-sm font-normal text-gray-500">{`${
              experience.startDate
            } – ${experience.endDate ?? "Current"}`}</span>
          </div>

          <div className="col-span-2 p-4 text-sm text-gray-500">
            <ul className="list-disc list-inside">
              {experience.bulletPoints.map((text) => (
                <li className="truncate leading-6">{text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkHistoryCard;
