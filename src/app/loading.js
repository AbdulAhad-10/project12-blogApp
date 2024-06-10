import { Spin } from "antd";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spin size="large" tip="Loading..." />
    </div>
  );
}
