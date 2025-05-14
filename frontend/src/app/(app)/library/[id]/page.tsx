import {
  GraduationCap,
  Calendar,
  Book,
  Bookmark,
  Clock4,
  CircleCheckBig,
} from "lucide-react";
const Capstone = () => {
  return (
    <>
      <h1>
        Marilag: An Intelligent Cacao Bean Segregation System Based on Extracted
        Features and Image Recognition
      </h1>
      <p>
        Jose Danrick B. Desiderio, Lance Andrei Victor R. Azores, Ronald Michael
        M. Barnachea, Liam Andrew U. Yang, Ronina C. Tayuan DITThis is the
        Capstone page.
      </p>
      <ul>
        <li>
          <GraduationCap className="size-4" />
          <span>BS Information Technology</span>
        </li>
        <li>
          <Book className="size-4" />
          <span>Automation</span>
        </li>
        <li>
          <Calendar />
          <span>November 2024</span>
        </li>
      </ul>
      <ul className="flex">
        <li>
          <Bookmark className="size-4" />
        </li>
        <li>
          <CircleCheckBig className="size-4" />
        </li>
        <li>
          <Clock4 className="size-4" />
        </li>
      </ul>

      <div>
        <h1>Abstract</h1>
        <p>
          Marilag: An Intelligent Cacao Bean Segregation System Based on
          Extracted Features and Image Recognition is designed to autonomously
          classify cacao beans into two categories: accepted or rejected.
          Utilizing IR sensors, servo motors, DC motors, stepper motors, and an
          ESP32 camera, the system processes data via a Raspberry Pi 4 and
          executes classification based on predefined quality parameters.
          Testing results indicate the system partially meets its primary
          objective of bean classification, with an overall segregation accuracy
          of 88%. This is primarily done through incremental learning and
          fine-tuning of the classification model using unseen dataset. However,
          inconsistencies and low specs of ESP32 camera significantly impact
          performance, same with the depositor and dispenser mechanisms. Low
          quality of real time image lead to blurry and inconsistent imaging,
          jamming issues in the depositor lead to stoppage of system, dispenser
          singulation issues lead to inconsistent bean singulation.{" "}
        </p>
      </div>

      <h3>Recommendations</h3>
      <div></div>

      <button>View Pdf</button>
    </>
  );
};

export default Capstone;
