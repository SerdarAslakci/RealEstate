using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealEstateProject.Models;
using System.Reflection.Emit;

namespace RealEstateProject.Data
{
    public class AppDbContext:IdentityDbContext
    {

        public AppDbContext(DbContextOptions options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasIndex(u => u.NormalizedUserName)
                .IsUnique(false);

            List<IdentityRole> roles = new List<IdentityRole>()
            {
                new IdentityRole()
                {
                    Name = "User",
                    NormalizedName = "USER"
                },
                new IdentityRole()
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                }
            };

            builder.Entity<IdentityRole>().HasData(roles);

            builder.Entity<UserFavourites>()
                .HasKey(uf => uf.Id);

            builder.Entity<UserFavourites>()
                .HasIndex(uf => new { uf.UserId, uf.HomeId })
                .IsUnique();  

            builder.Entity<HomeTransaction>()
                .HasOne(ht => ht.Home)
                .WithMany(h => h.HomeTransactions) 
                .HasForeignKey(ht => ht.HomeId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<UserFavourites>()
                .HasOne<AppUser>(uf => uf.AppUser)
                .WithMany(u => u.UserFavourites)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Restrict);  

            builder.Entity<UserFavourites>()
                .HasOne<Home>(uf => uf.Home)
                .WithMany(h => h.UserFavourites)
                .HasForeignKey(uf => uf.HomeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Comment>()
                .HasKey(e => e.Id);

            builder.Entity<Comment>()
                .HasOne<Home>(uf => uf.Home)
                .WithMany(h => h.Comments)
                .HasForeignKey(uf => uf.homeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Comment>()
                .HasOne<AppUser>(uf => uf.AppUser)
                .WithMany(x => x.Comments)
                .HasForeignKey(uf => uf.userId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Home>()
                .HasMany(h => h.HomeImage)
                .WithOne(hi => hi.Home)  
                .HasForeignKey(hi => hi.HomeId);

            
            builder.Entity<Conversation>()
                .HasOne(c => c.UserSender)
                .WithMany(u => u.ConversationsAsSender)
                .HasForeignKey(c => c.UserSenderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Conversation>()
                .HasOne(c => c.ReceiverUser)
                .WithMany(u => u.ConversationsAsReceiver)
                .HasForeignKey (c => c.ReceiverUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(c => c.Conversation)
                .WithMany(u => u.Messages)
                .HasForeignKey(x => x.ConversationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(c => c.SenderUser)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(x => x.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Conversation>()
            .HasIndex(c => new { c.UserSenderId, c.ReceiverUserId })
            .IsUnique();

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

        }

        public DbSet<Conversation> Conversation { get; set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<FavouriteFilters> FavouriteFilters { get; set; }
        public DbSet<Address> Address { get; set; }
        public DbSet<Home> Home { get; set; }
        public DbSet<HomeImage> HomeImage { get; set; }
        public DbSet<HomeTransaction> HomeTransaction { get; set; }
        public DbSet<HomeType> HomeType { get; set; }
        public DbSet<UserFavourites> UserFavourites { get; set; }
        public DbSet<Comment> Comments { get; set; }
    }
}
