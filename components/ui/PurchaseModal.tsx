import { ChevronDown, X } from 'lucide-react'
import React from 'react'

const PurchaseModal = ({ setIsModalOpen,
    supplierId,
    suppliers,
    addItem,
    items,
    updateItem,
    products,
    removeItem,
    createPO,
    setSupplierId,
    isSubmitting
}: any) => {

    const checkModel = ()=>{
        console.log("hello")
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#15171A]/40 p-4"
            onClick={() => setIsModalOpen(false)}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-po-title"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-lg border border-[#E8E6E1] bg-white p-6 shadow-lg"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="create-po-title" className="text-base font-medium text-[#15171A]">
                        New purchase order
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close"
                        className="rounded-md p-1 text-[#6B6F76] transition-colors hover:bg-[#FAFAF9] hover:text-[#15171A]"
                    >
                        <X className="h-4 w-4" strokeWidth={2} />
                    </button>

                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-[#6B6F76]">
                            Supplier
                        </label>
                        <div className="relative">
                            <select
                                value={supplierId}
                                onChange={(e) => setSupplierId(e.target.value)}
                                className="w-full appearance-none rounded-md border border-[#E8E6E1] px-3 py-2 pr-9 text-sm text-[#15171A] outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44]"
                            >
                                <option value="">Select supplier</option>
                                {suppliers.map((supplier: any) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F76]" />
                        </div>
                    </div>

                    <div>
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-[#6B6F76]">
                                    Items
                                </label>

                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-sm font-medium text-[#1F2A44]"
                                >
                                    + Add Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {items.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[2fr_1fr_auto] gap-3"
                                    >
                                        <div className="relative">
                                            <select
                                                value={item.productId}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "productId",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full appearance-none rounded-md border border-[#E8E6E1] px-3 py-2 pr-9 text-sm"
                                            >
                                                <option value="">
                                                    Select product
                                                </option>

                                                {products.map(
                                                    (product: any) => (
                                                        <option
                                                            key={product.id}
                                                            value={product.id}
                                                        >
                                                            {product.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F76]" />
                                        </div>

                                        <input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "quantity",
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            className="rounded-md border border-[#E8E6E1] px-3 py-2 text-sm"
                                        />

                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                                className="rounded-md border px-3 py-2 text-sm text-red-600"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-md px-4 py-2 text-sm font-medium text-[#6B6F76] transition-colors hover:bg-[#FAFAF9]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createPO}
                        disabled={
                            isSubmitting ||
                            !supplierId
                        }
                        className="inline-flex items-center justify-center rounded-md bg-[#1F2A44] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#162033] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating..." : "Create draft"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PurchaseModal
