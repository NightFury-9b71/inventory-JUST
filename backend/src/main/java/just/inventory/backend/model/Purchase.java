package just.inventory.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchases")
@Data
@NoArgsConstructor
public class Purchase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(hidden = true)
    private Long id;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<PurchaseItem> items = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "purchased_by_user_id", nullable = false)
    private User purchasedBy;

    @ManyToOne
    @JoinColumn(name = "office_id", nullable = false)
    private Office office;

    private String supplier;

    private String invoiceNumber;

    private String remarks;

    @Column(length = 500)
    private String receiptUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime purchasedDate;

    @PrePersist
    protected void onCreate() {
        purchasedDate = LocalDateTime.now();
    }
    
    @Transient
    public Double getTotalAmount() {
        return items.stream()
                .mapToDouble(PurchaseItem::getTotalPrice)
                .sum();
    }
    
    @Transient
    public Integer getTotalItems() {
        return items.size();
    }
}