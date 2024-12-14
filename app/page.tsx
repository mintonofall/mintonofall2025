import Image from "next/image";
import '@picocss/pico'

export default function Home() {
  return (
  <div>
    모두의 민턴에 오신걸 환영합니다.
  <form>
<label htmlFor="username">username</label>
    <input id="username" name="username" type="text"/>
    </form>
  </div>
  );
}
