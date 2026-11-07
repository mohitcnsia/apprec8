import Vision
import AppKit

let args = CommandLine.arguments
guard args.count > 1 else {
    print("Usage: swift ocr.swift <path_to_image>")
    exit(1)
}

let path = args[1]
let url = URL(fileURLWithPath: path)
guard let image = NSImage(contentsOf: url),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("Failed to load image at \(path)")
    exit(1)
}

let request = VNRecognizeTextRequest { request, error in
    guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
    for obs in observations {
        if let top = obs.topCandidates(1).first {
            let b = obs.boundingBox
            // Note: Vision boundingBox is normalized [0,1] with origin at bottom-left
            let w = Double(cgImage.width)
            let h = Double(cgImage.height)
            let cx = Int((b.origin.x + b.size.width / 2.0) * w)
            let cy = Int((1.0 - (b.origin.y + b.size.height / 2.0)) * h)
            print("[\(cx),\(cy)] \(top.string)")
        }
    }
}
request.recognitionLevel = .accurate
let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try? handler.perform([request])
