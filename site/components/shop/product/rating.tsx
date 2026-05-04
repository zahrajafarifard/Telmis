interface PropsType {
  rating: number;
  setRating: (val: number) => void;
}

const StarRating: React.FC<PropsType> = ({ rating, setRating }) => {
  // const [rating, setRating] = useState<number>(0); // Store the current rating

  // Update the rating when a star is clicked
  const handleClick = (index: number) => {
    setRating(index);
  };

  return (
    <div style={{ display: "flex", cursor: "pointer" }}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          filled={index < rating} // Fill stars up to the rating value
          onClick={() => handleClick(index + 1)} // Set the rating based on the star clicked
        />
      ))}
    </div>
  );
};

type StarProps = {
  filled: boolean;
  onClick: () => void;
};

const Star: React.FC<StarProps> = ({ filled, onClick }) => {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 27"
      fill={filled ? "gold" : "white"}
      width="24px"
      height="24px"
    >
      <path
        stroke="#919191"
        d="M14.998 0.717469L14.9992 0.713867V0.721071L18.0506 10.0989H27.9219L19.9319 15.9001L22.9844 25.2864L14.998 19.486L7.01172 25.2864L10.0642 15.9001L2.07422 10.0989H11.9455L14.9969 0.721071V0.713867L14.998 0.717469Z"
      />
    </svg>

    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="30"
    //   height="27"
    //   viewBox="0 0 30 27"
    //   fill="none"
    // >
    //   <path
    //     d="M14.998 0.717469L14.9992 0.713867V0.721071L18.0506 10.0989H27.9219L19.9319 15.9001L22.9844 25.2864L14.998 19.486L7.01172 25.2864L10.0642 15.9001L2.07422 10.0989H11.9455L14.9969 0.721071V0.713867L14.998 0.717469Z"
    //     fill="white"
    //     stroke="#919191"
    //   />
    // </svg>
  );
};

export default StarRating;
