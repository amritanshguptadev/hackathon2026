import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MacbookSale() {
  const [macbookId, setMacbookId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/featured-products")
      .then((res) => res.json())
      .then((data) => {
        const macbookProduct = data.find((item) =>
          item.title.toLowerCase().includes("macbook")
        );

        if (macbookProduct) {
          setMacbookId(macbookProduct._id);
        }
      })
      .catch((err) => {
        console.error("Error fetching macbook:", err);
      });
  }, []);
    return (
    <div className="pb-10 md:py-15">
        <Link to={`/api/product/${macbookId}`}>
          <img
            src="/Macbook/macbookPro.png"
            alt="Macbook Pro"
            className="cursor-pointer"
          />
        </Link>
    </div>
  );
}

