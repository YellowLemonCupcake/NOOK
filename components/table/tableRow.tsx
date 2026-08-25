import clsx from "clsx";

export default function TableRow({
   data,
   index,
}: {
   data: React.ReactNode[];
   index: number;
}) {
   return (
      <tr
         className={clsx(
            "text-center hover:bg-blue-50",
            index % 2 === 0 && "bg-gray-50",
         )}
      >
         {data.map((d, i) => (
            <td key={i} className="p-2">
               {d}
            </td>
         ))}
      </tr>
   );
}
