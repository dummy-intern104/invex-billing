
import React from "react";
import { BillItem } from "@/types/billing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BillPrintItemsTableProps {
  items: BillItem[];
  calculateSubtotal: () => number;
}

const BillPrintItemsTable: React.FC<BillPrintItemsTableProps> = ({
  items,
  calculateSubtotal
}) => {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 bg-[#4A7ADB] text-white text-center">#</TableHead>
          <TableHead className="bg-[#4A7ADB] text-white">Item name</TableHead>
          <TableHead className="bg-[#4A7ADB] text-white text-center w-20">Quantity</TableHead>
          <TableHead className="bg-[#4A7ADB] text-white text-right w-24">Price/Unit</TableHead>
          <TableHead className="bg-[#4A7ADB] text-white text-right w-24">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index} className="border">
            <TableCell className="border text-center p-1 text-xs">{index + 1}</TableCell>
            <TableCell className="border p-1 text-xs">{item.product_name}</TableCell>
            <TableCell className="border text-center p-1 text-xs">{item.quantity}</TableCell>
            <TableCell className="border text-right p-1 text-xs">₹ {item.price.toFixed(2)}</TableCell>
            <TableCell className="border text-right p-1 text-xs">₹ {(item.quantity * item.price).toFixed(2)}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={4} className="text-right font-bold border p-1 text-xs">Total</TableCell>
          <TableCell className="text-right font-bold border p-1 text-xs">₹ {calculateSubtotal().toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default BillPrintItemsTable;
