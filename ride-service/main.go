package main

import (
	"context"
	"fmt"
	"log"
	"net"

	pb "github.com/nynrathod/ride-service/proto" // Import the generated protobuf package
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// rideServer implements the RideService
type rideServer struct {
	pb.UnimplementedRideServiceServer
}

func main() {
	lis, err := net.Listen("tcp", ":4040")
	if err != nil {
		log.Fatalf("❌ Failed to listen on port 4040: %v", err)
	}

	// Create gRPC server with interceptor for logging requests
	s := grpc.NewServer(grpc.UnaryInterceptor(loggingInterceptor))
	pb.RegisterRideServiceServer(s, &rideServer{})
	reflection.Register(s)

	fmt.Println("🚀 RideService running on port 4040")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("❌ Failed to serve: %v", err)
	}
}

// Middleware: Log every incoming request
func loggingInterceptor(
	ctx context.Context, req interface{},
	info *grpc.UnaryServerInfo, handler grpc.UnaryHandler,
) (interface{}, error) {
	log.Printf("📡 Received request: %s | Data: %+v\n", info.FullMethod, req)
	return handler(ctx, req)
}

// Implement GetRide
func (s *rideServer) GetRide(ctx context.Context, req *pb.GetRideRequest) (*pb.RideResponse, error) {
	log.Printf("🛜 GetRide called: RideID=%s", req.RideId)

	return &pb.RideResponse{
		RideId:          req.RideId,
		UserId:          "123",
		DriverId:        "456",
		PickupLocation:  "A",
		DropoffLocation: "B",
		Status:          "Completed",
	}, nil
}

// Implement CreateRide
func (s *rideServer) CreateRide(ctx context.Context, req *pb.CreateRideRequest) (*pb.RideResponse, error) {
	log.Printf("🚗 CreateRide called: UserID=%s, DriverID=%s", req.UserId, req.DriverId)

	return &pb.RideResponse{
		RideId:          "789",
		UserId:          req.UserId,
		DriverId:        req.DriverId,
		PickupLocation:  req.PickupLocation,
		DropoffLocation: req.DropoffLocation,
		Status:          "Pending",
	}, nil
}

// Implement UpdateRideStatus
func (s *rideServer) UpdateRideStatus(ctx context.Context, req *pb.UpdateRideStatusRequest) (*pb.RideResponse, error) {
	log.Printf("🔄 UpdateRideStatus called: RideID=%s, NewStatus=%s", req.RideId, req.Status)

	return &pb.RideResponse{
		RideId: req.RideId,
		Status: req.Status,
	}, nil
}
