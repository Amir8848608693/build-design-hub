import { useState } from "react";
import { Check, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type ReturnStatus = "pending" | "approved" | "rejected";

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  reason: string;
  amount: number;
  status: ReturnStatus;
  requestDate: string;
}

const AdminReturns = () => {
  const { toast } = useToast();
  const [returns, setReturns] = useState<ReturnRequest[]>([
    {
      id: "1",
      orderId: "#12345",
      customerName: "John Doe",
      productName: "Sample Product 1",
      reason: "Defective item",
      amount: 299.99,
      status: "pending",
      requestDate: "2024-01-15"
    },
    {
      id: "2",
      orderId: "#12346",
      customerName: "Jane Smith",
      productName: "Sample Product 2",
      reason: "Wrong size",
      amount: 199.50,
      status: "pending",
      requestDate: "2024-01-14"
    },
    {
      id: "3",
      orderId: "#12347",
      customerName: "Bob Wilson",
      productName: "Sample Product 3",
      reason: "Changed mind",
      amount: 149.99,
      status: "approved",
      requestDate: "2024-01-13"
    }
  ]);

  const handleApprove = (id: string) => {
    setReturns(returns.map(ret => 
      ret.id === id ? { ...ret, status: "approved" as ReturnStatus } : ret
    ));
    toast({
      title: "Return Approved",
      description: "Return request has been approved. Refund will be processed."
    });
  };

  const handleReject = (id: string) => {
    setReturns(returns.map(ret => 
      ret.id === id ? { ...ret, status: "rejected" as ReturnStatus } : ret
    ));
    toast({
      title: "Return Rejected",
      description: "Return request has been rejected.",
      variant: "destructive"
    });
  };

  const statusColors = {
    pending: "bg-yellow-500 hover:bg-yellow-600",
    approved: "bg-green-500 hover:bg-green-600",
    rejected: "bg-red-500 hover:bg-red-600"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="returns" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Returns & Refunds</h1>
          <p className="text-muted-foreground mt-1">Manage return requests and refunds</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Pending Requests</p>
            <p className="text-2xl font-bold text-yellow-600">
              {returns.filter(r => r.status === "pending").length}
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {returns.filter(r => r.status === "approved").length}
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {returns.filter(r => r.status === "rejected").length}
            </p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-sm p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.map((returnReq) => (
                <TableRow key={returnReq.id}>
                  <TableCell className="font-medium">{returnReq.orderId}</TableCell>
                  <TableCell>{returnReq.customerName}</TableCell>
                  <TableCell>{returnReq.productName}</TableCell>
                  <TableCell className="text-muted-foreground">{returnReq.reason}</TableCell>
                  <TableCell className="font-semibold">${returnReq.amount.toFixed(2)}</TableCell>
                  <TableCell>{returnReq.requestDate}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[returnReq.status]}>
                      {returnReq.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {returnReq.status === "pending" && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApprove(returnReq.id)}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(returnReq.id)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminReturns;
