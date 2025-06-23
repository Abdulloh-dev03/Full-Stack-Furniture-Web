import { Main } from "./Pages/Header";
import { Products } from "./Pages/Products";
import Rooms from "./Pages/Rooms";
import Card from "./Pages/Card"
export default function Home() {
  return (
    <div>
      <Main/>
      <Products/>
      <Rooms/>
      <Card/>
    </div>
  );
}
