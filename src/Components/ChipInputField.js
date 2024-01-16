import { useEffect, useRef, useState } from "react";
import "../Styles/ChipInputField.css";
import { filmData } from "../DummyData/filmData";

function ChipInputField() {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputList, setInputList] = useState([]);
  const [firstBackspace, setFirstBackspace] = useState(false);
  const top100Films = filmData;

  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        e.target !== inputRef.current &&
        !suggestionRef.current.contains(e.target)
      ) {
        setShowSuggestion(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleKeyEvents = (e, value) => {
    if (!value.length && e.keyCode === 8 && !firstBackspace) {
      setFirstBackspace(true);
    } else if (!value.length && e.keyCode === 8 && firstBackspace) {
      setInputList(
        inputList.filter(
          (item) => item.title !== inputList[inputList.length - 1].title
        )
      );
      top100Films.push(value);
      setFirstBackspace(false);
      return;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (!value) return;
    const filteredData = top100Films.filter((film) =>
      film.title?.toLowerCase().includes(value?.toLowerCase())
    );
    setSuggestionList(filteredData);
    setFirstBackspace(false);
  };

  const closeTag = (film) => {
    setInputList(inputList.filter((item) => item.title !== film.title));
    top100Films.push(film);
  };
  const addTag = (film) => {
    setInputList([...inputList, film]);
    top100Films.splice(top100Films.indexOf(film), 1);
    setInputValue("");
    setSuggestionList([]);
  };
  return (
    <div className="container">
      <div className="tag-container">
        {inputList.map((film, index) => (
          <div
            className="tag-item"
            style={{
              background:
                index === inputList.length - 1 && firstBackspace
                  ? "#f1f1f1"
                  : "#dddcdc",
            }}
            key={index}
          >
            {film.title}
            <div
              className="close-icon"
              onClick={() => {
                closeTag(film);
              }}
            >
              x
            </div>
          </div>
        ))}
        <input
          type="text"
          placeholder="Enter movie name"
          className="input"
          onFocus={() => setShowSuggestion(true)}
          ref={inputRef}
          value={inputValue}
          onKeyDown={(e) => handleKeyEvents(e, e.target.value)}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div
        className="suggestion-area"
        style={{ display: showSuggestion ? "block" : "none" }}
        ref={suggestionRef}
      >
        {suggestionList.length > 0 ? (
          suggestionList.map((film, index) => (
            <div
              className="suggestion-item"
              onClick={() => addTag(film)}
              key={index}
            >
              {film.title}
            </div>
          ))
        ) : inputValue.length > 0 ? (
          <div className="suggestion-item">No data found</div>
        ) : (
          top100Films.map((film, index) => (
            <div
              className="suggestion-item"
              onClick={() => addTag(film)}
              key={index}
            >
              {film.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChipInputField;
