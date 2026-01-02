package just.inventory.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreatePurchaseRequest {
    private String supplier;
    private String invoiceNumber;
    private String remarks;
    private String receiptUrl;
    private List<PurchaseItemRequest> items;
    
    @Data
    public static class PurchaseItemRequest {
        private Long itemId;
        private Double quantity;
        private Double unitPrice;
    }
}
