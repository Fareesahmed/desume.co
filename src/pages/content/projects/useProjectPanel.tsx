import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CheckboxField from "../../../common/components/fields/CheckboxField";
import MonthYearField from "../../../common/components/fields/MonthYearField";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import SlideOver from "../../../common/components/SlideOver";
import useEditFlow from "../../../common/hooks/useEditFlow";
import { ProjectExperience } from "../../../common/interfaces/resume";
import BulletForm, { FormBullet } from "../components/BulletForm";

interface ProjectForm {
  projectName: string;
  projectWebsiteUrl?: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth?: string;
  endDateYear?: string;
  isOngoing: boolean;
}

function convertFormDataToExperience(formData: ProjectForm): ProjectExperience {
  return {
    projectName: formData.projectName,
    projectWebsiteUrl: formData.projectWebsiteUrl ?? "",
    startDate: {
      month: parseInt(formData.startDateMonth),
      year: parseInt(formData.startDateYear),
    },
    endDate: formData.isOngoing
      ? null
      : {
          month: parseInt(formData.endDateMonth!),
          year: parseInt(formData.endDateYear!),
        },
    bulletPoints: [],
    included: true,
  };
}

function convertExperienceToFormData(
  experience: ProjectExperience
): ProjectForm {
  return {
    projectName: experience.projectName,
    projectWebsiteUrl: experience.projectWebsiteUrl ?? undefined,
    startDateMonth: experience.startDate.month.toString(),
    startDateYear: experience.startDate.year.toString(),
    endDateMonth: experience.endDate?.month.toString(),
    endDateYear: experience.endDate?.year.toString(),
    isOngoing: !experience.endDate,
  };
}

/**
 * @param experience experience for edit or `null` for a new one.
 * @returns a promise of edited experience or `null` if deleted. Promise is rejected if user cancels.
 */
type OpenProjectPanel = (
  experience: ProjectExperience | null
) => Promise<ProjectExperience | null>;

export default function useProjectPanel(): [OpenProjectPanel, React.ReactNode] {
  const {
    register,
    reset,
    watch,
    getValues,
    trigger,
    formState: { isDirty },
  } = useForm<ProjectForm>();
  const [bullets, setBullets] = useState<FormBullet[]>([]);
  const touchedBulletsRef = useRef<boolean>(false);

  const { openEditDialog, buildDialogProps, confirmationPopups } =
    useEditFlow<ProjectExperience>();

  const openPanel = (experience: ProjectExperience | null) => {
    if (experience) {
      // Edit experience
      const prefilledForm = convertExperienceToFormData(experience);
      reset(prefilledForm);
      setBullets(
        experience.bulletPoints.map((bulletPoint) => ({
          ...bulletPoint,
          shouldDelete: false,
        }))
      );
    } else {
      // Add experience
      reset();
      setBullets([]);
    }
    touchedBulletsRef.current = false;
    return openEditDialog({ isCreateNew: experience === null });
  };

  const currentYear = new Date().getFullYear();

  return [
    openPanel,
    <SlideOver
      {...buildDialogProps({
        titleName: "project",
        getIsDirty: () => isDirty || touchedBulletsRef.current,
        getIsValid: () => trigger(undefined, { shouldFocus: true }),
        getDeleteName: () => `${getValues("projectName")}`,
        getData: () => {
          const formData = getValues();
          const newExperience = convertFormDataToExperience(formData);
          newExperience.bulletPoints = bullets.filter((b) => !b.shouldDelete);
          return newExperience;
        },
      })}
    >
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-6 sm:col-span-3">
          <TextField
            label="Project name"
            {...register("projectName", { required: true })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <WebsiteField
            label="Project website"
            {...register("projectWebsiteUrl")}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <MonthYearField
            label="Start date"
            endYear={currentYear}
            monthProps={register("startDateMonth", {
              required: true,
            })}
            yearProps={register("startDateYear", {
              required: true,
            })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <MonthYearField
            label="End date"
            endYear={currentYear}
            monthProps={register("endDateMonth", {
              required: !watch("isOngoing"),
              disabled: watch("isOngoing"),
            })}
            yearProps={register("endDateYear", {
              required: !watch("isOngoing"),
              disabled: watch("isOngoing"),
            })}
          />
        </div>

        <div className="col-span-6 flex -mt-2">
          <CheckboxField
            label="I'm still working on this project"
            {...register("isOngoing")}
          />
        </div>
      </div>

      <BulletForm
        bullets={bullets}
        onChange={(bullets) => {
          touchedBulletsRef.current = true;
          setBullets(bullets);
        }}
      />

      {confirmationPopups}
    </SlideOver>,
  ];
}
