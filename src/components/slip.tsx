export default function PaySlip() {
  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto">
      {/* Header Section with Company Branding */}
      <div className="relative bg-gray-100 p-8">
        {/* Left Yellow Triangle */}
        <div className="absolute left-0 top-0 w-0 h-0 border-l-[100px] border-l-yellow-400 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent"></div>

        {/* Top Left Black Triangle */}
        <div className="absolute left-0 top-0 w-0 h-0 border-l-[50px] border-l-black border-t-[50px] border-t-transparent"></div>

        {/* Company Logo and Name */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            MARKSOF
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">
            <span className="text-black">IT INNOVATION</span> <span className="text-yellow-400">AS A SERVICE</span>
          </p>
        </div>
      </div>

      {/* PaySlip Header */}
      <div className="bg-white px-8 py-4">
        <div className="flex justify-end">
          <div className="bg-black text-white px-6 py-2 relative">
            <span className="text-yellow-400 text-2xl font-bold">PAY</span>
            <span className="text-white text-2xl font-bold bg-black px-2">SLIP</span>
          </div>
        </div>
      </div>

      {/* Employee Information */}
      <div className="px-8 py-6 grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex">
            <span className="font-semibold text-gray-800 w-40">Employee Name :</span>
            <span className="text-gray-800">Syed Jawad Alam</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-800 w-40">Employee ID :</span>
            <span className="text-gray-800">E2209006</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-800 w-40">Job Title :</span>
            <span className="text-gray-800">Trainee Developer</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex">
            <span className="font-semibold text-gray-800 w-40">Salary Date :</span>
            <span className="text-gray-800">July</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-800 w-40">Mode of Payment :</span>
            <span className="text-gray-800">Online</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-800 w-40">Leaves Available :</span>
            <span className="text-gray-800">1.5 / 12</span>
          </div>
        </div>
      </div>

      {/* Earnings and Deductions Table */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-2 gap-0 border border-gray-300">
          {/* Earnings Section */}
          <div>
            {/* Earnings Header */}
            <div className="bg-yellow-400 text-center py-3">
              <div className="flex">
                <div className="w-16 bg-gray-300 text-black font-bold py-2 text-center border-r border-gray-400">
                  S.L
                </div>
                <div className="flex-1 text-black font-bold py-2 text-center">EARNINGS</div>
              </div>
            </div>

            {/* Earnings Rows */}
            <div className="bg-gray-100">
              <div className="flex border-b border-gray-300">
                <div className="w-16 bg-gray-300 text-center py-3 border-r border-gray-400 font-semibold">01</div>
                <div className="flex-1 px-4 py-3 border-r border-gray-300">Basic Salary</div>
                <div className="w-20 text-center py-3 font-semibold">25000</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-16 bg-gray-300 text-center py-3 border-r border-gray-400 font-semibold">02</div>
                <div className="flex-1 px-4 py-3 border-r border-gray-300">Fuel Allowance</div>
                <div className="w-20 text-center py-3 font-semibold">2500</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-16 bg-gray-300 text-center py-3 border-r border-gray-400 font-semibold">03</div>
                <div className="flex-1 px-4 py-3 border-r border-gray-300">Medical Allowance</div>
                <div className="w-20 text-center py-3 font-semibold">2500</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="w-16 bg-gray-300 text-center py-3 border-r border-gray-400 font-semibold">04</div>
                <div className="flex-1 px-4 py-3 border-r border-gray-300">Bonus</div>
                <div className="w-20 text-center py-3 font-semibold">0</div>
              </div>
              <div className="flex bg-gray-200">
                <div className="w-16 bg-gray-300 text-center py-3 border-r border-gray-400 font-semibold">05</div>
                <div className="flex-1 px-4 py-3 border-r border-gray-300 font-semibold">Total Amount</div>
                <div className="w-20 text-center py-3 font-bold">30000</div>
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="border-l border-gray-300">
            {/* Deductions Header */}
            <div className="bg-yellow-400 text-center py-3">
              <div className="text-black font-bold py-2">DEDUCTION</div>
            </div>

            {/* Deductions Rows */}
            <div className="bg-gray-100">
              <div className="flex border-b border-gray-300">
                <div className="flex-1 px-4 py-3 border-r border-gray-300">Late Deduction</div>
                <div className="w-20 text-center py-3 font-semibold">500</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 px-4 py-3 border-r border-gray-300">Absent Deduction</div>
                <div className="w-20 text-center py-3 font-semibold">0</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 px-4 py-3 border-r border-gray-300">Including Tax</div>
                <div className="w-20 text-center py-3 font-semibold">0</div>
              </div>
              <div className="flex border-b border-gray-300">
                <div className="flex-1 px-4 py-3 border-r border-gray-300 font-semibold">Total Deduction</div>
                <div className="w-20 text-center py-3 font-bold">500</div>
              </div>
              <div className="flex bg-gray-200">
                <div className="flex-1 px-4 py-3 border-r border-gray-300 font-semibold">Amount Payable</div>
                <div className="w-20 text-center py-3 font-bold">29500</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HR Signature */}
      <div className="px-8 pb-8">
        <div className="flex justify-end">
          <div className="text-right">
            <p className="font-semibold text-gray-800">Hr Sign</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black text-white px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p className="text-yellow-400">Plot # LS16 Ground Floor</p>
            <p className="text-yellow-400">Sector 5E, Orangi Twon</p>
            <p className="text-yellow-400">Karachi 75800,Pakistan</p>
          </div>
          <div className="text-sm text-right">
            <p className="text-yellow-400">www.maksof.com</p>
            <p className="text-yellow-400">info@maksofcom</p>
            <p className="text-yellow-400">(+92) 213-6661-104</p>
          </div>
        </div>
      </div>
    </div>
  )
}
