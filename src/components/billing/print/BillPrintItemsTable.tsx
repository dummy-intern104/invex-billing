
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
    <Table className="mt-6">
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 bg-blue-500 text-white">#</TableHead>
          <TableHead className="bg-blue-500 text-white">Item name</TableHead>
          <TableHead className="bg-blue-500 text-white text-right">Quantity</TableHead>
          <TableHead className="bg-blue-500 text-white text-right">Price/Unit</TableHead>
          <TableHead className="bg-blue-500 text-white text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index} className="border">
            <TableCell className="border">{index + 1}</TableCell>
            <TableCell className="border">{item.product_name}</TableCell>
            <TableCell className="border text-right">{item.quantity}</TableCell>
            <TableCell className="border text-right">₹ {item.price.toFixed(2)}</TableCell>
            <TableCell className="border text-right">₹ {(item.quantity * item.price).toFixed(2)}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={4} className="text-right font-bold border">Total</TableCell>
          <TableCell className="text-right font-bold border">₹ {calculateSubtotal().toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default BillPrintItemsTable;
