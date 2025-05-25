export const AboutStyles = {
    styles: `
        .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(25, 135, 84, 0.1) !important;
        }

        .icon-hover {
            transition: transform 0.3s ease;
        }

        .icon-hover:hover {
            transform: scale(1.1);
        }

        .stat-card {
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            color: #198754;
        }

        .stat-card:hover .display-4 {
            transform: scale(1.05);
        }

        .team-card {
            transition: all 0.3s ease;
        }

        .team-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 20px rgba(25, 135, 84, 0.15) !important;
        }

        .social-icon {
            transition: all 0.3s ease;
            display: inline-block;
        }

        .social-icon:hover {
            transform: scale(1.2);
            color: #198754 !important;
        }

        .cta-button {
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
        }

        .member-card {
            transition: all 0.3s ease;
            border: none;
            background: white;
            height: 100%;
        }

        .member-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(25, 135, 84, 0.1);
        }

        .member-image-container {
            aspect-ratio: 4/3;
            overflow: hidden;
            border-radius: 10px 10px 0 0;
            background-color: #f8f9fa;
        }

        .member-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 10px;
        }

        .member-info {
            padding: 1.5rem;
            text-align: center;
            background: white;
            border-radius: 0 0 10px 10px;
        }

        .member-role {
            color: #198754;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        .member-bio {
            color: #6c757d;
            font-size: 0.9rem;
            line-height: 1.6;
        }

        .member-social {
            margin-top: 1rem;
        }

        .member-social a {
            margin: 0 10px;
            color: #198754;
            transition: all 0.3s ease;
        }

        .member-social a:hover {
            transform: translateY(-3px);
        }

        .expertise-tags {
            margin-top: 1rem;
        }

        .expertise-tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            margin: 0.25rem;
            background-color: rgba(25, 135, 84, 0.1);
            color: #198754;
            border-radius: 20px;
            font-size: 0.8rem;
        }

        .hero-image {
            width: 100%;
            height: 500px;
            object-fit: contain;
            border-radius: 8px;
            background-color: #198754;
            padding: 10px;
        }
    `
}; 