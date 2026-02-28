package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/spartanjax/out-of-10/backend/internal/database"
	"github.com/spartanjax/out-of-10/backend/internal/handlers"
)

const version = "0.1.0"
const API_BASE = "192.168.86.30"

func main() {
	godotenv.Load()
	database.Connect()
	defer database.Pool.Close()
	database.Migrate()

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Public auth routes
	auth := r.Group("/api/v1/auth")
	auth.POST("/signup", handlers.Signup)
	auth.POST("/login", handlers.Login)

	// Authenticated routes
	api := r.Group("/api/v1")
	api.Use(handlers.AuthMiddleware())
	api.POST("/ratings", handlers.CreateRating)
	api.GET("/ratings", handlers.GetRatings)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on :%s", port)
	r.Run(API_BASE + ":" + port)
}
