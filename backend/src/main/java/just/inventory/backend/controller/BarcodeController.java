package just.inventory.backend.controller;

import com.google.zxing.WriterException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import just.inventory.backend.service.BarcodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/barcodes")
@Tag(name = "Barcode", description = "Barcode generation and printing APIs")
public class BarcodeController {

    @Autowired
    private BarcodeService barcodeService;

    @GetMapping("/generate/{barcodeText}")
    @Operation(summary = "Generate barcode image", description = "Generate a Code128 barcode image for the given text")
    public ResponseEntity<byte[]> generateBarcode(
            @PathVariable String barcodeText,
            @RequestParam(defaultValue = "400") int width,
            @RequestParam(defaultValue = "100") int height) {
        try {
            byte[] barcodeImage = barcodeService.generateBarcodeImage(barcodeText, width, height);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDispositionFormData("inline", "barcode.png");
            
            return new ResponseEntity<>(barcodeImage, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/qrcode/{barcodeText}")
    @Operation(summary = "Generate QR code", description = "Generate a QR code image for the given text")
    public ResponseEntity<byte[]> generateQRCode(
            @PathVariable String barcodeText,
            @RequestParam(defaultValue = "200") int width,
            @RequestParam(defaultValue = "200") int height) {
        try {
            byte[] qrImage = barcodeService.generateQRCode(barcodeText, width, height);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDispositionFormData("inline", "qrcode.png");
            
            return new ResponseEntity<>(qrImage, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/label/{itemInstanceId}")
    @Operation(summary = "Generate barcode label", description = "Generate a complete barcode label with item information")
    public ResponseEntity<byte[]> generateBarcodeLabel(@PathVariable Long itemInstanceId) {
        try {
            byte[] labelImage = barcodeService.generateBarcodeLabel(itemInstanceId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDispositionFormData("attachment", "barcode-label-" + itemInstanceId + ".png");
            
            return new ResponseEntity<>(labelImage, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/simple-label/{itemInstanceId}")
    @Operation(summary = "Generate simple barcode label", description = "Generate a simplified vertical barcode label (6x4 inches) with item name, office, and purchase date only")
    public ResponseEntity<byte[]> generateSimpleBarcodeLabel(@PathVariable Long itemInstanceId) {
        try {
            byte[] labelImage = barcodeService.generateSimpleBarcodeLabel(itemInstanceId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDispositionFormData("attachment", "barcode-" + itemInstanceId + ".png");
            
            return new ResponseEntity<>(labelImage, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/labels")
    @Operation(summary = "Generate multiple barcode labels", description = "Generate barcode labels for multiple item instances")
    public ResponseEntity<byte[]> generateBarcodeLabels(@RequestBody List<Long> itemInstanceIds) {
        try {
            byte[] labelsImage = barcodeService.generateBarcodeLabels(itemInstanceIds);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDispositionFormData("attachment", "barcode-labels.png");
            
            return new ResponseEntity<>(labelsImage, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/simple-labels")
    @Operation(summary = "Generate multiple simple barcode labels", description = "Generate simplified vertical barcode labels (6x4 inches) for multiple item instances")
    public ResponseEntity<byte[]> generateSimpleBarcodeLabels(@RequestBody List<Long> itemInstanceIds) {
        try {
            byte[] labelsImage = barcodeService.generateSimpleBarcodeLabels(itemInstanceIds);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDispositionFormData("attachment", "barcode-labels.png");
            
            return new ResponseEntity<>(labelsImage, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/labels-pdf")
    @Operation(summary = "Generate barcode labels as PDF", description = "Generate barcode labels for multiple item instances as a PDF file optimized for 6x4 inch thermal printing")
    public ResponseEntity<byte[]> generateBarcodeLabelsPDF(@RequestBody List<Long> itemInstanceIds) {
        try {
            byte[] pdfBytes = barcodeService.generateBarcodeLabelsPDF(itemInstanceIds);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "barcode-labels.pdf");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/escpos/{itemInstanceId}")
    @Operation(summary = "Generate ESC/POS commands", description = "Generate ESC/POS commands for direct thermal printer printing")
    public ResponseEntity<byte[]> generateESCPOS(@PathVariable Long itemInstanceId) {
        try {
            byte[] escposCommands = barcodeService.generateESCPOSCommands(itemInstanceId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "print-" + itemInstanceId + ".bin");
            
            return new ResponseEntity<>(escposCommands, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/escpos-multiple")
    @Operation(summary = "Generate ESC/POS commands for multiple labels", description = "Generate ESC/POS commands for printing multiple barcode labels")
    public ResponseEntity<byte[]> generateESCPOSMultiple(@RequestBody List<Long> itemInstanceIds) {
        try {
            byte[] escposCommands = barcodeService.generateESCPOSCommandsMultiple(itemInstanceIds);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "print-labels.bin");
            
            return new ResponseEntity<>(escposCommands, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/print-network")
    @Operation(summary = "Print to network printer", description = "Send print data directly to a network-connected thermal printer via raw socket")
    public ResponseEntity<Map<String, Object>> printToNetworkPrinter(@RequestBody Map<String, Object> request) {
        try {
            String printerIP = (String) request.get("printerIP");
            Integer printerPort = (Integer) request.get("printerPort");
            @SuppressWarnings("unchecked")
            List<Integer> dataList = (List<Integer>) request.get("data");
            
            if (printerIP == null || printerPort == null || dataList == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Missing required parameters: printerIP, printerPort, or data"
                ));
            }

            // Convert List<Integer> to byte[]
            byte[] data = new byte[dataList.size()];
            for (int i = 0; i < dataList.size(); i++) {
                data[i] = dataList.get(i).byteValue();
            }

            // Send data to network printer via raw socket
            try (Socket socket = new Socket(printerIP, printerPort);
                 OutputStream out = socket.getOutputStream()) {
                out.write(data);
                out.flush();
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Print job sent successfully to " + printerIP + ":" + printerPort
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Failed to send print job: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Invalid request: " + e.getMessage()
            ));
        }
    }
}
